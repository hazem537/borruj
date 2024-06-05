<template>
  <UForm :state="state" :schema="schema" @submit="onSubmit">
    <UCard>
      <template #header>
        <h1 class="text-amber-500 text-2xl font-semibold">العروض</h1>
      </template>
      <div v-if="!pending" class="flex items-center gap-5">
        <UFormGroup label="العرض" name="data" class="grow">
          <UInput v-model="state.data" />
        </UFormGroup>
        <UFormGroup label="اظهار" name="show">
          <UToggle v-model="state.show" color="amber" />
        </UFormGroup>
      </div>
      <div v-if="pending">Loading...</div>
      <template #footer>
        <UButton type="submit" color="amber">حفظ</UButton>
      </template>
    </UCard>
  </UForm>
</template>

<script lang="ts" setup>
import { object, string, boolean } from "yup";
import { collection, doc, updateDoc } from "firebase/firestore";
import { useDocument, useFirestore } from "vuefire";
import { watch, reactive } from "vue";

const db = useFirestore();
const docu = doc(collection(db, "assets"), "lEJtgJXfx9SGM0COpYJB");
const { data: ads, pending, error, value } = useDocument(docu, { once: true });

const schema = object({
  data: string(),
  show: boolean(),
});

const state = reactive({
  data: "",
  show: false,
});

// Watch the ads data and update the state when ads is loaded
watch(ads, (newAds) => {
  if (newAds) {
    state.data = newAds.data || "";
    state.show = newAds.show || false;
  }
});
const toast = useToast()
const onSubmit = () => {
  try {
    updateDoc(docu, { data: state.data, show: state.show });
    toast.add({title:"تم التعديل بنجاح"})
  } catch (err) {}
};
</script>

<style></style>
