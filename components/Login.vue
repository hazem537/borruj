<template>
  <UForm :state="state" :schema="schema" @submit="onSubmit" class="">
    <UCard class=" w-8/12 ">
      <template #header>
       
        <h1 class="text-3xl font-semibold text-amber-500">
          login as admin 
        </h1>
      </template>
  <UFormGroup name="email" label="email">
    <UInput v-model="state.email" />
  </UFormGroup>
  <UFormGroup name="password" label="password">
    <UInput type="password" v-model="state.password" />
  </UFormGroup>
  <div class="text-red-500" v-if="error">
    {{ error }}
  </div>  
<template #footer>
  <UButton type="submit" color="amber"> Login</UButton>
</template>
</UCard>
  </UForm>
</template>

<script lang="ts" setup>
import { object, string, type InferType } from 'yup'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'
import {  signInWithEmailAndPassword } from "firebase/auth";
const error = ref()
const auth = useFirebaseAuth()!
const schema = object({
  email:string().email().required(),
  password:string().required()
})
const state= reactive({email:"",password:""})
const onSubmit =()=>{
  signInWithEmailAndPassword(auth,state.email,state.password).then(res=>{
    // console.log(res)
// save user 
 navigateTo("/admin")

  }).catch(err=>{
    error.value="الايميل او الباسورد غير صحيح"
    // console.log(err)
  })
}
</script>

<style>

</style>