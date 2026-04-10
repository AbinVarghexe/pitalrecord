import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type ExtractedMedicine = {
  name: string
  dosage: string | null
  frequency: string | null
  duration: string | null
  instructions: string | null
}

type ExtractedPrescription = {
  hospital_name: string | null
  visit_date: string | null
  attending_doctor: string | null
  diagnoses: string[]
  medicines: ExtractedMedicine[]
  follow_up_date: string | null
  ai_confidence: number
  raw_text: string
}

async function extractWithFreeNvidiaModel(rawText: string, apiKey: string): Promise<ExtractedPrescription | null> {
  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta/llama-3.1-8b-instruct',
      temperature: 0,
      max_tokens: 700,
      messages: [
        {
          role: 'system',
          content:
            'Extract medical prescription entities into strict JSON. If missing, return null or empty arrays.',
        },
        {
          role: 'user',
          content: `Extract fields from this OCR text: ${rawText}. Return ONLY JSON with keys: hospital_name, visit_date, attending_doctor, diagnoses (array), medicines (array of {name,dosage,frequency,duration,instructions}), follow_up_date, ai_confidence, raw_text.`,
        },
      ],
    }),
  })

  if (!response.ok) return null
  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content || typeof content !== 'string') return null

  try {
    return JSON.parse(content) as ExtractedPrescription
  } catch {
    return null
  }
}

function localFreeFallbackExtraction(fileName: string): ExtractedPrescription {
  return {
    hospital_name: null,
    visit_date: null,
    attending_doctor: null,
    diagnoses: [],
    medicines: [],
    follow_up_date: null,
    ai_confidence: 0.2,
    raw_text: `OCR pending or unavailable for file: ${fileName}`,
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prescriptionId, fileUrl } = await req.json()

    if (!prescriptionId || !fileUrl) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabaseClient
      .from('prescriptions')
      .update({ extraction_status: 'processing' })
      .eq('id', prescriptionId)

    const fileName = String(fileUrl).split('/').pop() || 'document'
    const rawText = `Extracted text placeholder for ${fileName}`

    let extractedData: ExtractedPrescription | null = null
    const nvidiaApiKey = Deno.env.get('NVIDIA_API_KEY')

    if (nvidiaApiKey) {
      extractedData = await extractWithFreeNvidiaModel(rawText, nvidiaApiKey)
    }

    if (!extractedData) {
      extractedData = localFreeFallbackExtraction(fileName)
    }

    await supabaseClient
      .from('prescriptions')
      .update({
        hospital_name: extractedData.hospital_name,
        visit_date: extractedData.visit_date,
        attending_doctor: extractedData.attending_doctor,
        diagnosis: extractedData.diagnoses,
        follow_up_date: extractedData.follow_up_date,
        raw_text: extractedData.raw_text,
        ai_confidence: extractedData.ai_confidence,
        extraction_status: 'completed',
        extraction_data: extractedData,
      })
      .eq('id', prescriptionId)

    await supabaseClient.from('medicines').delete().eq('prescription_id', prescriptionId)

    if (extractedData.medicines && extractedData.medicines.length > 0) {
      const medicinesToInsert = extractedData.medicines
        .filter((med) => med.name?.trim())
        .map((med) => ({
          prescription_id: prescriptionId,
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          instructions: med.instructions,
        }))

      if (medicinesToInsert.length > 0) {
        await supabaseClient.from('medicines').insert(medicinesToInsert)
      }
    }

    return new Response(JSON.stringify({ success: true, prescriptionId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Edge Function Error:', message)
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
