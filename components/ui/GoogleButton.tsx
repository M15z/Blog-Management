"use client"
import { Button } from "@/components/ui/button";
import { signIn} from "next-auth/react";



export default function GoogleButton(){
    

const handleClick = async () => {
  await signIn("google", { callbackUrl: "/" }); // or your desired URL
};

    return(
         <Button
         onClick={handleClick} 
         variant="outline" className="w-full">
        Login with Google
    </Button>
    )
}