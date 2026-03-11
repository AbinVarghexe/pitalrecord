import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prescriptionId, profileId, fileUrl } = await req.json()

    if (!prescriptionId || !fileUrl) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Initialize Supabase Client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Need service role to bypass RLS for background job
    )

    // 1. Download the file from Storage
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from('prescriptions')
      .download(fileUrl)

    if (downloadError) throw downloadError

    // 2. Here we would normally run Tesseract OCR or a Cloud Vision API.
    // In an edge function without native OCR binaries, we rely on an external API (like OpenAI Vision or Google Cloud Vision)
    
    // For this boilerplate, we'll simulate sending it to OpenAI Vision API for direct JSON extraction
    const formData = new FormData();
    formData.append('file', fileData, 'prescription');

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) throw new Error("Missing OpenAI API Key");

    // Construct the prompt for OpenAI to extract medical entities
    const prompt = `You are a medical data extraction assistant. Extract the following entities
from the prescription image provided. Return ONLY a valid JSON object with
these keys: hospital_name, visit_date (ISO 8601), attending_doctor,
diagnoses (array), medicines (array of {name, dosage, frequency, duration,
instructions}), follow_up_date (ISO 8601 or null). If a field cannot be
determined, set it to null.`;

    // (Pseudo-code for actual OpenAI Vision call, requires converting BLOB to Base64 first)
    // const base64Image = await blobToBase64(fileData);
    // const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', { ... });
    
    // Simulating extracted output for development
    const extractedData = {
      hospital_name: "Mock General Hospital",
      visit_date: new Date().toISOString().split('T')[0],
      attending_doctor: "Dr. Smith",
      diagnoses: ["Hypertension", "Type 2 Diabetes"],
      medicines: [
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily", duration: "30 days", instructions: "Take after meals" },
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days", instructions: "Take in the morning" }
      ],
      ai_confidence: 0.95,
      raw_text: "[Raw OCR text would go here]"
    }

    // 3. Update the Prescription Record
    await supabaseClient
      .from('prescriptions')
      .update({
        hospital_name: extractedData.hospital_name,
        visit_date: extractedData.visit_date,
        attending_doctor: extractedData.attending_doctor,
        diagnosis: extractedData.diagnoses,
        raw_text: extractedData.raw_text,
        ai_confidence: extractedData.ai_confidence
      })
      .eq('id', prescriptionId)

    // 4. Insert Medicines
    if (extractedData.medicines && extractedData.medicines.length > 0) {
      const medicinesToInsert = extractedData.medicines.map(med => ({
        prescription_id: prescriptionId,
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.instructions
      }))

      await supabaseClient
        .from('medicines')
        .insert(medicinesToInsert)
    }

    return new Response(JSON.stringify({ success: true, prescriptionId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Edge Function Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
