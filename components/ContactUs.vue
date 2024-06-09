<template>
  <div class="flex flex-col justify-center items-center text-sm md:text-base p-4">
    <div
      class="flex flex-col gap-3 bg-white/55 dark:bg-black rounded-xl border items-center border-amber-500 p-5">
      <h2 class="text-2xl text-amber-500 text-center">اتصل بنا</h2>
      <p>
        نسعد بتواصلكم معنا لأي استفسارات أو حجوزات. يرجى ملء النموذج أدناه
        وسنقوم بالرد عليكم في أقرب وقت ممكن.
      </p>
      <div class="w-8/12">
        <UForm
          class="flex flex-col gap-2 w-full"
          :schema="schema"
          :state="state"
          @submit="onSubmit">
          <div class="flex flex-col md:flex-row  w-full gap-3 justify-between">
            <UFormGroup label="الاسم" name="name" class="grow">
              <UInput v-model="state.name" />
            </UFormGroup>

            <UFormGroup label="البريد الالكتروني" name="email" class="grow">
              <UInput v-model="state.email" />
            </UFormGroup>
          </div>

          <UFormGroup label="الموضوع " name="object">
            <UInput v-model="state.object" />
          </UFormGroup>
          <UFormGroup label=" الرسالة" name="message">
            <UTextarea v-model="state.message" />
          </UFormGroup>

          <UButton block type="submit" color="amber" :loading="pending"> ارسل لنا </UButton>
        </UForm>
      </div>
      <div class="flex flex-col md:flex-row">
        <div class="flex flex-col p-2 gap-2">
          <h2 class="text-2xl text-amber-500 text-center">تفاصيل الاتصال</h2>
          <p class="">
            <span class="text-amber-500">
              الهاتف
            </span>
            : 0507583933
            <br />
            <span class="text-amber-500">
              البريد الإلكتروني
            </span>
            :Buroujtourism@gmail.com
          </p>
        </div>
        <div class="flex flex-col p-2 gap-2">
          <h2 class="text-2xl text-amber-500 text-center">ساعات العمل</h2>
          <p class="">السبت - الخميس: 9:00 صباحًا - 6:00 مساءً</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { object, string } from "yup";
const pending = ref(false)
const schema = object({
  name: string().required(),
  email: string().email().required(),
  object: string().required(),
  message: string().required(),
});
const state = reactive({ name: "", email: "", object: "", message: "" });
import {  setDoc,addDoc,doc, collection } from "firebase/firestore";
const db = useFirestore();
// const messageCollection = collection(db,"messages")
const toast=useToast();
const onSubmit = async() => {
  try{
   pending.value=true 
    const docref=await addDoc(collection(db,'messages'),state)
    // console.log("HELLO",docref.id)
  }catch(error){
console.log(error)
  }finally{
    pending.value=false
  }

};
</script>

<style></style>
