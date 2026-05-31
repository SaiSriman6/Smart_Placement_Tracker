import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateStudent = () => {

   const navigate = useNavigate();
   const { id } = useParams();

   // if sending full student object using navigate state

   const [formData, setFormData] = useState({
   name: "",
   email: "",
   rollNumber: "",
   branch: "",
   cgpa: "",
   backlogs: "",
   isPlaced: false
  });

   useEffect(() => {
   const fetchStudent = async () => {
      try {
         const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/auth/user/${id}`,
         );
         console.log(response);
        setFormData({
           name: response.data.payload.name || "",
           email: response.data.payload.email || "",
           rollNumber: response.data.payload.rollNumber || "",
           branch: response.data.payload.branch || "",
           cgpa: response.data.payload.cgpa || "",
           backlogs: response.data.payload.backlogs || "0",
           isPlaced: response.data.payload.isPlaced || false
      });
      } catch (err) {
         console.log(err);
      }
      };
      fetchStudent();
    }, [id]);

   const handleChange = (e) => {

      setFormData({
         ...formData,
         [e.target.name]: e.target.value
      });

   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/auth/user/core/${id}`,
            formData,
         );
         alert(response.data.message);
         navigate("/admin/students");
      } catch (err) {
         console.log(err);
         alert(err.response?.data?.message || "Something went wrong");
      }
   };

   return (
      <div className="min-h-screen bg-slate-950 text-white p-8">
         <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h1 className="text-3xl font-bold mb-8">
               Update Student Core Details
            </h1>
            <form
               onSubmit={handleSubmit}
               className="space-y-5"
            >
               <div>
                  <label className="block mb-2 text-slate-300">
                     Name
                  </label>
                  <input
                     type="text"
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                     className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none"
                  />
               </div>

               <div>
                  <label className="block mb-2 text-slate-300">
                     Email
                  </label>

                  <input
                     type="email"
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none"
                  />
               </div>

               <div>
                  <label className="block mb-2 text-slate-300">
                     Roll Number
                  </label>

                  <input
                     type="text"
                     name="rollNumber"
                     value={formData.rollNumber}
                     onChange={handleChange}
                     className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none"
                  />
               </div>

               <div>
                  <label className="block mb-2 text-slate-300">
                     Department
                  </label>

                  <input
                     type="text"
                     name="branch"
                     value={formData.branch}
                     onChange={handleChange}
                     className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none"
                  />
               </div>

               <div>
                  <label className="block mb-2 text-slate-300">
                     CGPA
                  </label>

                  <input
                     type="number"
                     step="0.01"
                     name="cgpa"
                     value={formData.cgpa}
                     onChange={handleChange}
                     className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none"
                  />
               </div>

               <div>
                  <label className="block mb-2 text-slate-300">
                     Active Backlogs
                  </label>

                  <input
                      type="number"
                      name="backlogs"
                      value={formData.backlogs || ""}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none"
                   />
               </div>

               <div>
                  <label className="block mb-2 text-slate-300">
                     Placement Status
                  </label>

                 <select
   name="isPlaced"
   value={formData.isPlaced}
   onChange={(e) =>
      setFormData({
         ...formData,
         isPlaced: e.target.value === "true"
      })
   }
   className="
      w-full
      bg-slate-950
      text-white
      border
      border-slate-700
      rounded-xl
      px-4
      py-3
      outline-none
      appearance-none
   "
>
   <option
      value="true"
      className="bg-slate-900 text-white"
   >
      Placed
   </option>

   <option
      value="false"
      className="bg-slate-900 text-white"
   >
      Not Placed
   </option>
</select>
               </div>

               <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 transition-all py-3 rounded-xl font-semibold"
               >
                  Update Student
               </button>

            </form>

         </div>

      </div>

   );

};

export default UpdateStudent;