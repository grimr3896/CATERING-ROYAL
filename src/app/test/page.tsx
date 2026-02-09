'use client'

import { supabase } from '@/lib/supabase'
import { useEffect } from 'react'

export default function Test() {
  const fetchData = async () => {
    const { data, error } = await supabase.from('services').select('*')
    console.log('Supabase test output:', data, error)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return <div>Check console for Supabase test output</div>
}
