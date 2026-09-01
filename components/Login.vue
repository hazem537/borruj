<template>
  <div class="w-full max-w-md mx-auto p-4">
    <div class="glass-panel rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      <!-- Glow decoration -->
      <div class="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>
      <div class="absolute -bottom-12 -left-12 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <!-- Header -->
      <div class="text-center space-y-2 mb-8 relative z-10">
        <div class="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-3 shadow-inner">
          <UIcon name="i-mdi-shield-lock-outline" class="w-7 h-7" />
        </div>
        <h1 class="text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
          تسجيل دخول الإدارة
        </h1>
        <p class="text-xs md:text-sm text-stone-500 dark:text-stone-400">
          لوحة تحكم إدارة محتوى بروج السياحية
        </p>
      </div>

      <!-- Error Alert -->
      <UAlert
        v-if="errorMessage"
        color="red"
        variant="soft"
        icon="i-mdi-alert-circle-outline"
        :title="errorMessage"
        class="mb-6 rounded-xl"
        :close-button="{ icon: 'i-mdi-close', color: 'red', variant: 'link' }"
        @close="errorMessage = ''"
      />

      <!-- Form -->
      <UForm :state="state" :schema="schema" @submit="onSubmit" class="space-y-5 relative z-10">
        <UFormGroup label="البريد الإلكتروني" name="email" required>
          <UInput
            v-model="state.email"
            type="email"
            size="lg"
            placeholder="admin@borruj.com"
            icon="i-mdi-email-outline"
            autocomplete="email"
            class="rounded-xl"
          />
        </UFormGroup>

        <UFormGroup label="كلمة المرور" name="password" required>
          <UInput
            v-model="state.password"
            :type="showPassword ? 'text' : 'password'"
            size="lg"
            placeholder="••••••••"
            icon="i-mdi-lock-outline"
            autocomplete="current-password"
            class="rounded-xl"
          >
            <template #trailing>
              <UButton
                color="gray"
                variant="link"
                :icon="showPassword ? 'i-mdi-eye-off-outline' : 'i-mdi-eye-outline'"
                :padded="false"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormGroup>

        <UButton
          type="submit"
          block
          size="lg"
          color="amber"
          :loading="isLoading"
          class="font-bold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all mt-6"
        >
          <template #leading>
            <UIcon name="i-mdi-login" />
          </template>
          تسجيل الدخول
        </UButton>
      </UForm>

      <!-- Back Link -->
      <div class="mt-6 text-center">
        <ULink
          to="/"
          class="text-xs text-stone-500 hover:text-amber-500 transition-colors inline-flex items-center gap-1"
        >
          <UIcon name="i-mdi-arrow-right" class="w-3.5 h-3.5" />
          <span>العودة إلى الصفحة الرئيسية</span>
        </ULink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { object, string } from "yup";
import { useFirebaseAuth } from "vuefire";
import { signInWithEmailAndPassword } from "firebase/auth";

const auth = useFirebaseAuth();
const toast = useToast();

const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const schema = object({
  email: string().email("يرجى إدخال بريد إلكتروني صالح").required("البريد الإلكتروني مطلوب"),
  password: string().min(6, "كلمة المرور يجب أن لا تقل عن 6 خانات").required("كلمة المرور مطلوبة"),
});

const state = reactive({
  email: "",
  password: "",
});

const onSubmit = async () => {
  if (!auth) {
    errorMessage.value = "خدمة المصادقة غير مفعلة، يرجى مراجعة إعدادات Firebase.";
    return;
  }

  try {
    isLoading.value = true;
    errorMessage.value = "";
    await signInWithEmailAndPassword(auth, state.email, state.password);

    toast.add({
      title: "تم تسجيل الدخول بنجاح",
      description: "مرحباً بك في لوحة تحكم بروج",
      color: "emerald",
      icon: "i-mdi-check-circle",
    });

    navigateTo("/admin");
  } catch (err: any) {
    console.error("Login error:", err);
    if (err?.code === "auth/invalid-credential" || err?.code === "auth/user-not-found" || err?.code === "auth/wrong-password") {
      errorMessage.value = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    } else if (err?.code === "auth/too-many-requests") {
      errorMessage.value = "تم تعطيل المحاولات مؤقتاً بسبب تكرار المحاولات الخاطئة. حاول لاحقاً.";
    } else {
      errorMessage.value = err?.message || "حدث خطأ أثناء محاولة تسجيل الدخول.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
