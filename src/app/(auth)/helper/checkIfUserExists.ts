import { User } from "@/lib/models/User";

export async function checkIfUserExists(email: string) {
  if (!email || email === "") return;

  // Check if email already exists in db
  const isUserExists: boolean | null = await User.findOne({
    email,
  });

  const awaitedResponse = await isUserExists;

  return awaitedResponse;
}
//
// import React, { useState, useCallback } from "react";
// import debounce from "lodash.debounce"; // Importing debounce utility (optional)
// import { Input } from "@/components/ui/input"; // Assuming your custom Input component
// import { checkIfUserExists } from "@/app/(auth)/helper/checkIfUserExists";
//
// const RegisterForm: React.FC = () => {
//   const [error, setError] = useState<string | null>(null);
//   const [isChecking, setIsChecking] = useState(false);
//
//   const handleBlur = async (value: string) => {
//     if (!value) {
//       setError(null); // Reset error state if input is empty
//       return;
//     }
//
//     setIsChecking(true);
//     try {
//       const exists = await checkIfUserExists(value);
//       if (exists) {
//         setError("Username already exists");
//       } else {
//         setError(null);
//       }
//     } catch (err) {
//       setError("Error checking username");
//     } finally {
//       setIsChecking(false);
//     }
//   };
//
//   // Debounced handler to avoid rapid API requests
//   const debouncedHandleChange = useCallback(
//       debounce(async (value: string) => {
//         await handleBlur(value);
//       }, 500), // Adjust debounce interval (milliseconds) as necessary
//       []
//   );
//
//   return (
//       <form>
//           <div>
//               <Input
//                   id="name"
//   type="text"
//   placeholder="John Doe"
//   name="name"
//   onChange={(e) => debouncedHandleChange(e.target.value)}
//   onBlur={(e) => handleBlur(e.target.value)} // Optional to validate
//   />
//   {isChecking && <p className="text-sm text-muted">Checking...</p>}
//     {error && <p className="text-sm text-red-500">{error}</p>}
//         </div>
//       {/* Rest of your form */}
//       </form>
//     );
//     };
//
//     export default RegisterForm;
