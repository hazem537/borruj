<template>
  <div class="space-y-4">
    <!-- Top Stats & Filter Bar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
          <UIcon name="i-mdi-email-multiple-outline" class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>صندوق رسائل وشكاوى واستفسارات العملاء</span>
            <UBadge color="amber" variant="subtle" size="sm" class="rounded-full font-bold">
              {{ filteredMessages.length }} رسالة
            </UBadge>
          </h2>
          <p class="text-xs text-stone-500 dark:text-stone-400">
            إدارة ومتابعة طلبات الحجز والاستفسارات والشكاوى الواردة من نموذج الموقع
          </p>
        </div>
      </div>

      <!-- Search Input -->
      <div class="w-full sm:w-72 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <UInput
          v-model="searchQuery"
          icon="i-mdi-magnify"
          placeholder="ابحث بالاسم، البريد أو الموضوع..."
          size="sm"
          class="rounded-xl flex-1"
        />
        <UButton
          v-if="legacyMessageCount > 0"
          size="sm"
          color="red"
          variant="soft"
          icon="i-mdi-database-remove-outline"
          class="rounded-xl font-bold shrink-0"
          @click="openLegacyCleanupModal"
        >
          تنظيف البيانات القديمة ({{ legacyMessageCount }})
        </UButton>
      </div>
    </div>

    <!-- Category Filter Chips -->
    <div class="flex flex-wrap items-center gap-2">
      <button
        v-for="cat in categoryFilters"
        :key="cat.id"
        type="button"
        @click="selectedCategory = cat.id"
        class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
        :class="selectedCategory === cat.id
          ? 'bg-amber-500 text-stone-950 shadow-sm'
          : 'bg-white/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'"
      >
        <UIcon :name="cat.icon" class="w-3.5 h-3.5" />
        <span>{{ cat.label }}</span>
      </button>
    </div>

    <!-- Messages Container -->
    <div v-if="pending" class="flex flex-col items-center justify-center py-12 gap-3">
      <UIcon name="i-mdi-loading" class="w-8 h-8 text-amber-500 animate-spin" />
      <span class="text-sm text-stone-500">جاري تحميل الرسائل...</span>
    </div>

    <div v-else-if="filteredMessages.length === 0" class="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-white/40 dark:bg-stone-900/40 border border-dashed border-stone-300 dark:border-stone-800">
      <div class="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 mb-3">
        <UIcon name="i-mdi-email-open-outline" class="w-8 h-8" />
      </div>
      <h3 class="text-base font-bold text-stone-700 dark:text-stone-300">لا توجد رسائل حالياً</h3>
      <p class="text-xs text-stone-500 max-w-sm mt-1">
        {{ searchQuery ? 'لم يتم العثور على رسائل تطابق كلمة البحث' : 'ستظهر هنا كافة استفسارات وحجوزات وشكاوى الزوار فور إرسالها من نموذج التواصل' }}
      </p>
    </div>

    <div v-else class="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto p-1">
      <div
        v-for="msg in filteredMessages"
        :key="msg.id"
        class="glass-panel rounded-2xl p-4 md:p-5 border border-stone-200 dark:border-stone-800 hover:border-amber-500/40 hover:shadow-md transition-all flex flex-col gap-3 group"
      >
        <!-- Header info -->
        <div class="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-sm shrink-0">
              {{ (msg.name || 'ع')[0] }}
            </div>
            <div>
              <h4 class="font-bold text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
                <span>{{ msg.name }}</span>
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-bold"
                  :class="getTypeBadgeClass(msg.type)"
                >
                  {{ getTypeLabel(msg.type) }}
                </span>
                <span v-if="msg.dateString" class="text-xs text-stone-400 font-normal">
                  ({{ msg.dateString }})
                </span>
              </h4>
              <div class="flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                <a :href="`mailto:${msg.email}`" class="hover:text-amber-500 flex items-center gap-1 transition-colors">
                  <UIcon name="i-mdi-email-outline" class="w-3.5 h-3.5" />
                  <span>{{ msg.email }}</span>
                </a>
                <a v-if="msg.phone" :href="`tel:${msg.phone}`" class="hover:text-amber-500 flex items-center gap-1 transition-colors" dir="ltr">
                  <UIcon name="i-mdi-phone-outline" class="w-3.5 h-3.5" />
                  <span>{{ msg.phone }}</span>
                </a>
              </div>
            </div>
          </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <a
            v-if="msg.phone"
            :href="`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`السلام عليكم أخي الكريم ${msg.name}، بخصوص تواصلكم مع مؤسسة بروج المميزة للسياحة (${msg.object || ''})...`)}`"
            target="_blank"
            rel="noopener noreferrer"
            class="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
            title="مراسلة عبر واتساب"
          >
            <UIcon name="i-mdi-whatsapp" class="w-3.5 h-3.5" />
            <span>واتساب</span>
          </a>

          <a
            :href="`mailto:${msg.email}?subject=رد: ${encodeURIComponent(msg.object || '')}`"
            class="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-600 dark:text-amber-400 hover:text-stone-950 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="رد بالبريد"
          >
            <UIcon name="i-mdi-reply" class="w-3.5 h-3.5" />
            <span>رد بالبريد</span>
          </a>

          <UButton
            size="xs"
            color="red"
            variant="soft"
            icon="i-mdi-trash-can-outline"
            class="rounded-lg"
            :loading="deletingId === msg.id"
            @click="promptDeleteMessage(msg)"
            title="حذف الرسالة (Soft Delete)"
          />
        </div>
        </div>

        <!-- Subject & Content -->
        <div class="space-y-1.5">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">الموضوع</span>
            <span class="text-sm font-bold text-stone-800 dark:text-stone-200">{{ msg.object }}</span>
          </div>

          <p class="text-xs md:text-sm text-stone-600 dark:text-stone-300 whitespace-pre-wrap leading-relaxed bg-stone-50 dark:bg-stone-950/50 p-3 rounded-xl border border-stone-200/50 dark:border-stone-800/50">
            {{ msg.message }}
          </p>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal for Delete Message (Soft Delete) -->
    <UModal v-model="isDeleteModalOpen" :ui="{ width: 'sm:max-w-md' }">
      <div v-if="messageToDelete" class="p-6 space-y-4 bg-white dark:bg-stone-900 rounded-2xl">
        <div class="flex items-center gap-3 text-red-500">
          <div class="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center font-bold text-xl shrink-0">
            <UIcon name="i-mdi-trash-can-alert-outline" class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-base font-bold text-stone-900 dark:text-stone-100">
              تأكيد حذف الرسالة
            </h3>
            <p class="text-xs text-stone-500">سيتم أرشفة الرسالة وحذفها من الصندوق (Soft Delete)</p>
          </div>
        </div>

        <div class="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-stone-700 dark:text-stone-300 space-y-2">
          <p class="font-semibold text-stone-900 dark:text-stone-100">
            هل أنت متأكد من رغبتك في حذف هذه الرسالة؟
          </p>
          <div class="p-2.5 rounded-lg bg-white/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 space-y-1 text-[11px]">
            <div class="text-stone-800 dark:text-stone-200 font-bold">
              👤 المرسل: {{ messageToDelete.name }} ({{ messageToDelete.phone || messageToDelete.email }})
            </div>
            <div class="text-stone-600 dark:text-stone-400">
              📌 الموضوع: {{ messageToDelete.object }}
            </div>
            <div class="text-stone-500">
              🏷️ النوع: {{ getTypeLabel(messageToDelete.type) }} | {{ messageToDelete.dateString || '' }}
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="isDeleteModalOpen = false">إلغاء</UButton>
          <UButton
            color="red"
            class="font-bold rounded-xl"
            :loading="isDeleting"
            @click="confirmSoftDelete"
          >
            تأكيد الحذف
          </UButton>
        </div>
      </div>
    </UModal>

    <!-- Legacy Data Hard-Delete Confirmation Modal -->
    <UModal v-model="isLegacyCleanupModalOpen" :ui="{ width: 'sm:max-w-md' }">
      <div class="p-6 space-y-4 bg-white dark:bg-stone-900 rounded-2xl">
        <div class="flex items-center gap-3 text-red-500">
          <div class="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
            <UIcon name="i-mdi-database-remove-outline" class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-base font-bold text-stone-900 dark:text-stone-100">
              تنظيف البيانات القديمة نهائياً
            </h3>
            <p class="text-xs text-stone-500">حذف دائم ولا يمكن التراجع عنه</p>
          </div>
        </div>

        <div class="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-stone-700 dark:text-stone-300 space-y-2">
          <p class="font-semibold text-stone-900 dark:text-stone-100">
            سيتم حذف <strong>{{ legacyMessageCount }}</strong> رسالة قديمة نهائياً من Firestore.
          </p>
          <p class="text-stone-600 dark:text-stone-400 leading-relaxed">
            يشمل ذلك الرسائل التي تحتوي على حقول النموذج القديم (تواريخ الإقامة، عدد النزلاء، الملاحظات) والرسائل المؤرشفة مسبقاً.
          </p>
          <p class="text-red-600 dark:text-red-400 font-bold">
            لن يتم حذف الرسائل الحالية التي تحتوي على نص الرسالة فقط.
          </p>
        </div>

        <UFormGroup label="اكتب «حذف» للتأكيد" class="text-xs">
          <UInput
            v-model="legacyCleanupConfirmText"
            placeholder="حذف"
            size="sm"
            class="rounded-xl"
            :disabled="isLegacyDeleting"
          />
        </UFormGroup>

        <div class="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
          <UButton color="gray" variant="ghost" :disabled="isLegacyDeleting" @click="closeLegacyCleanupModal">
            إلغاء
          </UButton>
          <UButton
            color="red"
            class="font-bold rounded-xl"
            :loading="isLegacyDeleting"
            :disabled="legacyCleanupConfirmText.trim() !== 'حذف'"
            @click="confirmLegacyHardDelete"
          >
            حذف نهائي ({{ legacyMessageCount }})
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { collection, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { useCollection, useFirestore } from "vuefire";

const db = useFirestore();
const toast = useToast();
const deletingId = ref<string | null>(null);
const searchQuery = ref("");
const selectedCategory = ref("all");

// Delete Confirmation Modal State
const isDeleteModalOpen = ref(false);
const messageToDelete = ref<any>(null);
const isDeleting = ref(false);

// Legacy hard-delete cleanup
const isLegacyCleanupModalOpen = ref(false);
const legacyCleanupConfirmText = ref("");
const isLegacyDeleting = ref(false);

const isLegacyMessage = (m: any) => {
  if (!m) return false;
  const hasLegacyField =
    m.checkIn != null ||
    m.checkOut != null ||
    m.guestCount != null ||
    m.roomsCount != null ||
    m.notes != null ||
    m.totalNights != null;
  const isSoftDeleted = m.isDeleted === true || m.deleted === true;
  return hasLegacyField || isSoftDeleted;
};

const messagesRef = collection(db, "messages");
const { data: messagesList, pending } = useCollection(messagesRef);

const legacyMessages = computed(() => {
  if (!messagesList.value) return [];
  return messagesList.value.filter((m: any) => isLegacyMessage(m));
});

const legacyMessageCount = computed(() => legacyMessages.value.length);

const categoryFilters = [
  { id: "all", label: "الكل", icon: "i-mdi-inbox" },
  { id: "booking_request", label: "طلبات الحجز", icon: "i-mdi-calendar-edit" },
  { id: "complaint", label: "الشكاوى 24/7", icon: "i-mdi-alert-octagon-outline" },
  { id: "inquiry", label: "الاستفسارات", icon: "i-mdi-help-circle-outline" },
  { id: "cancellation_or_modification", label: "إلغاء وتعديل", icon: "i-mdi-calendar-clock" },
];

const getTypeLabel = (type?: string) => {
  switch (type) {
    case "booking_request":
      return "طلب حجز";
    case "complaint":
      return "شكوى رسمية";
    case "cancellation_or_modification":
      return "طلب إلغاء/تعديل";
    default:
      return "استفسار عام";
  }
};

const getTypeBadgeClass = (type?: string) => {
  switch (type) {
    case "booking_request":
      return "bg-amber-500/20 text-amber-700 dark:text-amber-300";
    case "complaint":
      return "bg-red-500/20 text-red-700 dark:text-red-300";
    case "cancellation_or_modification":
      return "bg-blue-500/20 text-blue-700 dark:text-blue-300";
    default:
      return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300";
  }
};

const filteredMessages = computed(() => {
  if (!messagesList.value) return [];
  let list = messagesList.value.filter((m: any) => !m.isDeleted && !m.deleted);

  if (selectedCategory.value !== "all") {
    list = list.filter((m: any) => m.type === selectedCategory.value);
  }

  if (!searchQuery.value.trim()) return list;

  const q = searchQuery.value.toLowerCase().trim();
  return list.filter((m: any) => {
    return (
      (m.name && m.name.toLowerCase().includes(q)) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.object && m.object.toLowerCase().includes(q)) ||
      (m.message && m.message.toLowerCase().includes(q)) ||
      (m.phone && m.phone.toLowerCase().includes(q))
    );
  });
});

const promptDeleteMessage = (msg: any) => {
  messageToDelete.value = msg;
  isDeleteModalOpen.value = true;
};

const confirmSoftDelete = async () => {
  if (!messageToDelete.value) return;

  try {
    isDeleting.value = true;
    deletingId.value = messageToDelete.value.id;
    await updateDoc(doc(db, "messages", messageToDelete.value.id), {
      isDeleted: true,
      deletedAt: serverTimestamp(),
    });
    toast.add({
      title: "تم حذف الرسالة بنجاح (حذف آمن)",
      description: "تمت إزالة الرسالة من صندوق الوارد بنجاح.",
      color: "emerald",
      icon: "i-mdi-check-circle",
    });
    isDeleteModalOpen.value = false;
    messageToDelete.value = null;
  } catch (err: any) {
    console.error("Delete message error:", err);
    toast.add({
      title: "حدث خطأ أثناء الحذف",
      description: err?.message,
      color: "red",
      icon: "i-mdi-alert-circle",
    });
  } finally {
    isDeleting.value = false;
    deletingId.value = null;
  }
};

const openLegacyCleanupModal = () => {
  legacyCleanupConfirmText.value = "";
  isLegacyCleanupModalOpen.value = true;
};

const closeLegacyCleanupModal = () => {
  if (isLegacyDeleting.value) return;
  isLegacyCleanupModalOpen.value = false;
  legacyCleanupConfirmText.value = "";
};

const confirmLegacyHardDelete = async () => {
  if (legacyCleanupConfirmText.value.trim() !== "حذف") return;

  const toDelete = [...legacyMessages.value];
  if (toDelete.length === 0) {
    toast.add({
      title: "لا توجد بيانات قديمة",
      description: "لم يتم العثور على رسائل قديمة للحذف.",
      color: "amber",
      icon: "i-mdi-information-outline",
    });
    closeLegacyCleanupModal();
    return;
  }

  try {
    isLegacyDeleting.value = true;
    let deletedCount = 0;
    for (const msg of toDelete) {
      if (!msg.id) continue;
      await deleteDoc(doc(db, "messages", msg.id));
      deletedCount++;
    }
    toast.add({
      title: "تم تنظيف البيانات القديمة",
      description: `تم حذف ${deletedCount} رسالة نهائياً من Firestore.`,
      color: "emerald",
      icon: "i-mdi-check-circle",
    });
    closeLegacyCleanupModal();
  } catch (err: any) {
    console.error("Legacy cleanup error:", err);
    toast.add({
      title: "حدث خطأ أثناء التنظيف",
      description: err?.message,
      color: "red",
      icon: "i-mdi-alert-circle",
    });
  } finally {
    isLegacyDeleting.value = false;
  }
};
</script>
