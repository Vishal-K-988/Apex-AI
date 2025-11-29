// get started button 
'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function GetStarted_Button() {

    const router = useRouter();
  return <Button variant="outline" onClick={() => {
    router.push ("/home")
  }} > Go to ApexEdit   </Button>
}
