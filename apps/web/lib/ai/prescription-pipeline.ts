import { createClient } from '@/lib/supabase/server'

type TriggerAIInput = {
  prescriptionId: string
  fileUrl: string
}

export async function triggerPrescriptionAIProcessing(input: TriggerAIInput) {
  const supabase = await createClient()

  const { error } = await supabase.functions.invoke('process-prescription', {
    body: input,
  })

  if (error) {
    await supabase
      .from('prescriptions')
      .update({
        extraction_status: 'failed',
        extraction_data: {
          error: error.message,
          name: error.name,
          context: 'supabase.functions.invoke(process-prescription)',
        },
      })
      .eq('id', input.prescriptionId)
  }
}
