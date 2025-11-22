import { SignUpForm } from "@/features/auth/components/signup-form"
import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireAuth();  
  return (
    <div>
      <SignUpForm />  
    </div>
  )
}

export default Page;