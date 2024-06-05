<template>
  <div>
    <UCard>
      <template #header>
        <div class="flex gap-5">
          <UBadge color="amber">  {{ docSnap.length }}</UBadge>
          <h1 class="text-amber-500 text-2xl font-semibold">الرسائل</h1>
        </div>
      </template>
      <div v-if="docSnap" class="flex flex-col gap-5 h-full max-h-[30vh] overflow-scroll">
    
        <div
          class="flex flex-col  p-4 bg-slate-600/55 rounded-md border border-amber-500"
          v-for="doc in docSnap">
          <div class="flex flex-col">
            <div class="flex gap-5">
              <p>
                <span class="text-amber-500 font-semibold"> الاسم </span>
                {{ doc.name }}
              </p>
              <p>
                <span class="text-amber-500 font-semibold"> الايميل </span>
                {{ doc.email }}
              </p>
              <p>
                <span class="text-amber-500 font-semibold"> العنوان </span>
                {{ doc.object }}
              </p>
            </div>
            <div></div>
          </div>
          <div class="flex flex-col">
            <p class="text-amber-500 font-semibold">الرساله</p>
            <p>{{ doc.object }}</p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { collection, doc, getDoc ,deleteDoc } from "firebase/firestore";
import { useCollection } from "vuefire";
const db = useFirestore();

const collecRef = collection(db, "messages");
const { data: docSnap, error, pending } = await useCollection(collecRef);
const onDelete=async(id:string)=>{
  await deleteDoc(doc(db, "messages", id));
}
</script>

<style></style>
