import { SignUpForm } from "@/features/auth/components/signup-form"
import { requireUnAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnAuth();  
  return (
    <SignUpForm />  
  )
}

export default Page;