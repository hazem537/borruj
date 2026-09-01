<template>
  <div class="space-y-6">
    <!-- Top Filter & Type Switcher Bar -->
    <div class="glass-panel p-5 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xl">
            <UIcon name="i-mdi-calendar-check" class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-lg font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>إدارة الحجوزات وطلبات العملاء</span>
              <UBadge color="amber" variant="solid" size="xs" class="rounded-full font-mono">
                {{ filteredListCount }}
              </UBadge>
            </h2>
            <p class="text-xs text-stone-500 dark:text-stone-400">
              متابعة وجدولة طلبات الحجز والتواصل المباشر مع الضيوف وإدارة حالات الحجز
            </p>
          </div>
        </div>

        <!-- Search Input -->
        <div class="w-full sm:w-72">
          <UInput
            v-model="searchQuery"
            icon="i-mdi-magnify"
            placeholder="ابحث بالاسم، الجوال، الفندق..."
            size="sm"
            class="rounded-xl"
          />
        </div>
      </div>

      <!-- Segment Tabs (Requests vs Online Paid) -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-200 dark:border-stone-800">
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            @click="activeSubTab = 'form_requests'; selectedStatus = 'all'"
            class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            :class="activeSubTab === 'form_requests'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'"
          >
            <UIcon name="i-mdi-form-select" class="w-4 h-4" />
            <span>طلبات الحجز الواردة من النموذج</span>
            <UBadge :color="activeSubTab === 'form_requests' ? 'black' : 'amber'" size="2xs" variant="subtle">
              {{ bookingRequests.length }}
            </UBadge>
          </button>

          <button
            type="button"
            @click="activeSubTab = 'direct_paid'; selectedStatus = 'all'"
            class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            :class="activeSubTab === 'direct_paid'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'"
          >
            <UIcon name="i-mdi-credit-card-check-outline" class="w-4 h-4" />
            <span>حجوزات السداد المباشر (فيزا / ماستركارد)</span>
            <UBadge :color="activeSubTab === 'direct_paid' ? 'black' : 'emerald'" size="2xs" variant="subtle">
              {{ directBookingsListClean.length }}
            </UBadge>
          </button>
        </div>

        <!-- Expand All / Collapse All Helper -->
        <div v-if="filteredBookingRequests.length > 0 || filteredDirectBookings.length > 0" class="flex items-center gap-2">
          <button
            type="button"
            @click="toggleAllRows"
            class="text-[11px] font-bold text-stone-500 hover:text-amber-500 transition-colors flex items-center gap-1 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-lg"
          >
            <UIcon :name="isAllExpanded ? 'i-mdi-chevron-up' : 'i-mdi-chevron-down'" class="w-3.5 h-3.5" />
            <span>{{ isAllExpanded ? 'طي كافة التفاصيل' : 'توسيع كافة التفاصيل' }}</span>
          </button>
        </div>
      </div>

      <!-- Status Filter Chips Bar -->
      <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/60">
        <span class="text-xs font-bold text-stone-500 ml-1 flex items-center gap-1">
          <UIcon name="i-mdi-filter-variant" class="w-3.5 h-3.5 text-amber-500" />
          <span>تصفية بالحالة:</span>
        </span>

        <template v-if="activeSubTab === 'form_requests'">
          <button
            v-for="st in statusFilterOptions"
            :key="st.value"
            type="button"
            @click="selectedStatus = st.value"
            class="px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            :class="selectedStatus === st.value
              ? 'bg-amber-500 text-stone-950 shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'"
          >
            <span>{{ st.label }}</span>
            <span class="text-[10px] font-mono opacity-80">({{ getStatusCount(st.value) }})</span>
          </button>
        </template>

        <template v-else>
          <button
            v-for="st in directStatusFilterOptions"
            :key="st.value"
            type="button"
            @click="selectedStatus = st.value"
            class="px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            :class="selectedStatus === st.value
              ? 'bg-amber-500 text-stone-950 shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'"
          >
            <span>{{ st.label }}</span>
            <span class="text-[10px] font-mono opacity-80">({{ getDirectStatusCount(st.value) }})</span>
          </button>
        </template>
      </div>
    </div>

    <!-- 1. FORM BOOKING REQUESTS TAB -->
    <div v-if="activeSubTab === 'form_requests'">
      <div v-if="pendingMessages" class="flex flex-col items-center justify-center py-12 gap-3">
        <UIcon name="i-mdi-loading" class="w-8 h-8 text-amber-500 animate-spin" />
        <span class="text-sm text-stone-500">جاري تحميل طلبات الحجز...</span>
      </div>

      <div
        v-else-if="filteredBookingRequests.length === 0"
        class="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-white/40 dark:bg-stone-900/40 border border-dashed border-stone-300 dark:border-stone-800"
      >
        <div class="w-14 h-14 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 mb-3">
          <UIcon name="i-mdi-calendar-blank-outline" class="w-7 h-7" />
        </div>
        <h3 class="text-base font-bold text-stone-700 dark:text-stone-300">لا توجد طلبات حجز مطابقة</h3>
        <p class="text-xs text-stone-500 max-w-sm mt-1">
          {{ searchQuery || selectedStatus !== 'all' ? 'لا توجد نتائج تطابق معايير البحث والتصفية المحددة' : 'ستظهر هنا كافة طلبات الحجز المرسلة من قبل زوار الموقع فور تسجيلها.' }}
        </p>
      </div>

      <!-- Structured Table / Expandable Rows -->
      <div v-else class="space-y-3">
        <!-- Table Header (Desktop) -->
        <div class="hidden lg:grid grid-cols-12 gap-3 px-5 py-2.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider bg-stone-100/80 dark:bg-stone-800/60 rounded-2xl border border-stone-200/60 dark:border-stone-800/60">
          <div class="col-span-3">بيانات الضيف / العميل</div>
          <div class="col-span-3">الوحدة أو الفندق المطلوب</div>
          <div class="col-span-3">تفاصيل الطلب المرسلة</div>
          <div class="col-span-3 text-center">حالة الطلب والإجراءات</div>
        </div>

        <!-- Booking Request Row -->
        <div
          v-for="req in filteredBookingRequests"
          :key="req.id"
          class="rounded-2xl bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 hover:shadow-md transition-all overflow-hidden"
          :class="{ 'ring-1 ring-amber-500/40 border-amber-500/40': isRowExpanded(req.id) }"
        >
          <!-- Main Row Summary Grid -->
          <div class="p-4 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            <!-- Col 1: Guest (3 cols) -->
            <div class="col-span-1 lg:col-span-3 flex items-center gap-3">
              <button
                type="button"
                @click="toggleRow(req.id)"
                class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-all"
                :class="isRowExpanded(req.id) ? 'bg-amber-500 text-stone-950 shadow' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-stone-950'"
                :title="isRowExpanded(req.id) ? 'طي التفاصيل' : 'عرض التفاصيل الكاملة'"
              >
                <UIcon :name="isRowExpanded(req.id) ? 'i-mdi-chevron-up' : 'i-mdi-chevron-down'" class="w-5 h-5" />
              </button>

              <div class="space-y-0.5 min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <h4 class="font-bold text-sm text-stone-900 dark:text-stone-100 truncate" :title="req.name">
                    {{ req.name }}
                  </h4>
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-bold"
                    :class="getStatusClass(req.status)"
                  >
                    {{ getStatusLabel(req.status) }}
                  </span>
                </div>
                <div class="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <a v-if="req.phone" :href="`tel:${req.phone}`" class="hover:text-amber-500 font-mono" dir="ltr">
                    {{ req.phone }}
                  </a>
                  <span v-if="req.dateString" class="text-[10px] text-stone-400 truncate">
                    • {{ req.dateString }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Col 2: Requested Unit / Hotel (3 cols) -->
            <div class="col-span-1 lg:col-span-3 space-y-0.5">
              <div class="flex items-center gap-1.5 text-xs text-stone-800 dark:text-stone-200 font-bold">
                <UIcon name="i-mdi-office-building" class="w-4 h-4 text-amber-500 shrink-0" />
                <span class="truncate" :title="req.object">{{ req.object || 'طلب حجز إقامة' }}</span>
              </div>
              <div v-if="req.bookingDetails?.priceSar" class="text-[11px] text-stone-500 font-mono">
                السعر/ليلة: <strong class="text-amber-600 dark:text-amber-400">{{ req.bookingDetails.priceSar }} ر.س</strong>
              </div>
            </div>

            <!-- Col 3: Message preview (3 cols) -->
            <div class="col-span-1 lg:col-span-3 space-y-0.5 text-xs min-w-0">
              <div class="flex items-start gap-1.5 text-stone-700 dark:text-stone-300">
                <UIcon name="i-mdi-message-text-outline" class="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <p
                  v-if="req.message"
                  class="line-clamp-2 whitespace-pre-wrap leading-relaxed text-stone-600 dark:text-stone-400"
                  :title="req.message"
                >
                  {{ truncateMessage(req.message, 120) }}
                </p>
                <span v-else class="text-stone-400 italic">—</span>
              </div>
            </div>

            <!-- Col 4: Actions & Quick Status (3 cols) -->
            <div class="col-span-1 lg:col-span-3 flex items-center justify-end gap-1.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-200 dark:border-stone-800">
              <!-- Quick Status Selector -->
              <USelect
                v-model="req.status"
                :options="statusOptions"
                option-attribute="label"
                value-attribute="value"
                size="xs"
                class="w-28 rounded-xl"
                @change="updateStatus(req.id, req.status)"
              />

              <!-- WhatsApp Action -->
              <a
                v-if="req.phone"
                :href="getWhatsAppLink(req)"
                target="_blank"
                rel="noopener noreferrer"
                class="p-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white transition-all inline-flex items-center justify-center"
                title="مراسلة سريعة عبر واتساب"
              >
                <UIcon name="i-mdi-whatsapp" class="w-4 h-4" />
              </a>

              <!-- Details Toggle Button -->
              <UButton
                size="xs"
                :color="isRowExpanded(req.id) ? 'amber' : 'gray'"
                :variant="isRowExpanded(req.id) ? 'solid' : 'soft'"
                class="rounded-xl font-bold"
                @click="toggleRow(req.id)"
              >
                <span>{{ isRowExpanded(req.id) ? 'إخفاء' : 'تفاصيل' }}</span>
              </UButton>

              <!-- Delete (Soft Delete) -->
              <UButton
                size="xs"
                color="red"
                variant="ghost"
                icon="i-mdi-trash-can-outline"
                class="rounded-xl"
                @click="promptDelete(req, 'messages')"
                title="حذف الطلب (Soft Delete)"
              />
            </div>
          </div>

          <!-- Expanded Accordion Details Panel -->
          <div
            v-if="isRowExpanded(req.id)"
            class="p-5 bg-stone-50/90 dark:bg-stone-950/70 border-t border-stone-200 dark:border-stone-800 space-y-4 animate-fade-in"
          >
            <!-- Full message details -->
            <div class="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
              <span class="font-bold text-amber-500 flex items-center gap-1.5 pb-2 border-b border-stone-100 dark:border-stone-800">
                <UIcon name="i-mdi-message-text-outline" class="w-4 h-4" />
                <span>تفاصيل الرسالة المرسلة:</span>
              </span>
              <p
                v-if="req.message"
                class="text-stone-700 dark:text-stone-300 whitespace-pre-wrap leading-relaxed text-sm"
              >
                {{ req.message }}
              </p>
              <p v-else class="text-stone-400 italic">لا توجد رسالة مرفقة</p>
            </div>

            <!-- Unit Info & Contact -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <!-- Left: Unit & Booking Object -->
              <div class="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                <div class="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                  <span class="font-bold text-amber-500 flex items-center gap-1.5">
                    <UIcon name="i-mdi-domain" class="w-4 h-4" />
                    <span>تفاصيل المنشأة / الباقة:</span>
                  </span>
                  <span v-if="req.bookingDetails?.permitNumber" class="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    تصريح: {{ req.bookingDetails.permitNumber }}
                  </span>
                </div>
                <p class="font-bold text-sm text-stone-900 dark:text-stone-100">{{ req.object }}</p>
                <div v-if="req.bookingDetails" class="space-y-1 text-stone-500 text-[11px]">
                  <div v-if="req.bookingDetails.nameEn" dir="ltr" class="font-sans text-stone-400">
                    {{ req.bookingDetails.nameEn }}
                  </div>
                  <div v-if="req.bookingDetails.priceSar" class="font-mono font-bold text-amber-600">
                    السعر لليلة: {{ req.bookingDetails.priceSar }} ر.س (شامل 15% ضريبة)
                  </div>
                </div>
              </div>

              <!-- Right: Customer Contact Details -->
              <div class="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                <span class="font-bold text-amber-500 flex items-center gap-1.5 pb-2 border-b border-stone-100 dark:border-stone-800">
                  <UIcon name="i-mdi-account-details-outline" class="w-4 h-4" />
                  <span>بيانات الاتصال:</span>
                </span>
                <div class="flex flex-wrap items-center gap-3 text-stone-600 dark:text-stone-300">
                  <a v-if="req.email" :href="`mailto:${req.email}`" class="hover:text-amber-500 flex items-center gap-1">
                    <UIcon name="i-mdi-email-outline" class="w-3.5 h-3.5" />
                    <span>{{ req.email }}</span>
                  </a>
                  <a v-if="req.phone" :href="`tel:${req.phone}`" class="hover:text-amber-500 flex items-center gap-1 font-mono" dir="ltr">
                    <UIcon name="i-mdi-phone-outline" class="w-3.5 h-3.5" />
                    <span>{{ req.phone }}</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Operations Direct Action Bar in Expanded View -->
            <div class="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 dark:border-stone-800">
              <div class="flex items-center gap-2">
                <span class="text-xs text-stone-500 font-bold">تغيير حالة الطلب:</span>
                <USelect
                  v-model="req.status"
                  :options="statusOptions"
                  option-attribute="label"
                  value-attribute="value"
                  size="xs"
                  class="w-36 rounded-xl"
                  @change="updateStatus(req.id, req.status)"
                />
              </div>

              <div class="flex items-center gap-2">
                <a
                  v-if="req.phone"
                  :href="getWhatsAppLink(req)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                >
                  <UIcon name="i-mdi-whatsapp" class="w-4 h-4" />
                  <span>محادثة واتساب فورية</span>
                </a>

                <a
                  v-if="req.phone"
                  :href="`tel:${req.phone}`"
                  class="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-700 dark:text-amber-300 hover:text-stone-950 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <UIcon name="i-mdi-phone" class="w-4 h-4" />
                  <span>اتصال هاتفي</span>
                </a>

                <UButton
                  size="xs"
                  color="red"
                  variant="soft"
                  icon="i-mdi-trash-can-outline"
                  class="rounded-xl font-bold"
                  @click="promptDelete(req, 'messages')"
                >
                  حذف آمن
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. DIRECT PAID BOOKINGS TAB -->
    <div v-else-if="activeSubTab === 'direct_paid'">
      <div v-if="pendingBookings" class="flex flex-col items-center justify-center py-12 gap-3">
        <UIcon name="i-mdi-loading" class="w-8 h-8 text-amber-500 animate-spin" />
        <span class="text-sm text-stone-500">جاري تحميل حجوزات السداد المباشر...</span>
      </div>

      <div
        v-else-if="filteredDirectBookings.length === 0"
        class="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-white/40 dark:bg-stone-900/40 border border-dashed border-stone-300 dark:border-stone-800"
      >
        <div class="w-14 h-14 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 mb-3">
          <UIcon name="i-mdi-credit-card-remove-outline" class="w-7 h-7" />
        </div>
        <h3 class="text-base font-bold text-stone-700 dark:text-stone-300">لا توجد حجوزات سداد مباشر مطابقة</h3>
        <p class="text-xs text-stone-500 max-w-sm mt-1">
          {{ searchQuery || selectedStatus !== 'all' ? 'لا توجد نتائج تطابق معايير البحث والتصفية' : 'عند تفعيل خدمة الدفع المباشر وسداد الضيف، سيتم قيد الحجز وإصدار السند آلياً هنا.' }}
        </p>
      </div>

      <!-- Direct Bookings Table / Expandable Rows -->
      <div v-else class="space-y-3">
        <!-- Table Header (Desktop) -->
        <div class="hidden lg:grid grid-cols-12 gap-3 px-5 py-2.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider bg-stone-100/80 dark:bg-stone-800/60 rounded-2xl border border-stone-200/60 dark:border-stone-800/60">
          <div class="col-span-3">رقم الحجز والضيف</div>
          <div class="col-span-3">المنشأة وتصريح السياحة</div>
          <div class="col-span-3">المبلغ الإجمالي وفترة الإقامة</div>
          <div class="col-span-3 text-center">حالة السداد والسند</div>
        </div>

        <!-- Direct Booking Row -->
        <div
          v-for="b in filteredDirectBookings"
          :key="b.id"
          class="rounded-2xl bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 hover:shadow-md transition-all overflow-hidden"
          :class="{ 'ring-1 ring-amber-500/40 border-amber-500/40': isRowExpanded(b.id) }"
        >
          <!-- Row Summary Grid -->
          <div class="p-4 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            <!-- Col 1: ID & Guest (3 cols) -->
            <div class="col-span-1 lg:col-span-3 flex items-center gap-3">
              <button
                type="button"
                @click="toggleRow(b.id)"
                class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-all"
                :class="isRowExpanded(b.id) ? 'bg-amber-500 text-stone-950 shadow' : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-amber-500 hover:text-stone-950'"
              >
                <UIcon :name="isRowExpanded(b.id) ? 'i-mdi-chevron-up' : 'i-mdi-chevron-down'" class="w-5 h-5" />
              </button>

              <div class="space-y-0.5 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-xs font-bold text-amber-600 dark:text-amber-400" dir="ltr">#{{ b.id }}</span>
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-bold"
                    :class="b.status === 'paid' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'"
                  >
                    {{ b.status === 'paid' ? 'مدفوع (PAID)' : 'قيد السداد' }}
                  </span>
                  <span v-if="b.isSandbox" class="px-1 py-0.2 rounded bg-stone-200 dark:bg-stone-800 text-[9px] font-mono">
                    Sandbox
                  </span>
                </div>
                <h4 class="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                  {{ b.guestName }}
                </h4>
              </div>
            </div>

            <!-- Col 2: Hotel & Permit (3 cols) -->
            <div class="col-span-1 lg:col-span-3 space-y-0.5">
              <div class="font-bold text-xs text-stone-800 dark:text-stone-200 truncate">
                🏨 {{ b.itemNameAr || 'حجز إقامة' }}
              </div>
              <div class="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                تصريح: {{ b.permitNumber }}
              </div>
            </div>

            <!-- Col 3: Amount & Stay (3 cols) -->
            <div class="col-span-1 lg:col-span-3 space-y-0.5 text-xs">
              <div class="font-mono font-black text-amber-600 dark:text-amber-400 text-sm">
                {{ b.amountSar }} <span class="text-xs text-stone-500 font-sans font-bold">ر.س شامل الضريبة</span>
              </div>
              <div class="text-[11px] text-stone-500 font-mono" dir="ltr">
                {{ b.checkIn }} ➔ {{ b.checkOut }} ({{ b.totalNights }} ليلة)
              </div>
            </div>

            <!-- Col 4: Actions & Receipt (3 cols) -->
            <div class="col-span-1 lg:col-span-3 flex items-center justify-end gap-1.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-200 dark:border-stone-800">
              <ULink
                :to="`/booking/${b.id}`"
                target="_blank"
                class="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-600 dark:text-amber-400 hover:text-stone-950 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <UIcon name="i-mdi-open-in-new" class="w-3.5 h-3.5" />
                <span>عرض السند</span>
              </ULink>

              <a
                v-if="b.guestPhone"
                :href="`https://wa.me/${b.guestPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`السلام عليكم أخي الكريم ${b.guestName}، بخصوص حجزك رقم #${b.id} في مؤسسة بروج المميزة للسياحة...`)}`"
                target="_blank"
                class="p-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white text-xs font-semibold flex items-center justify-center transition-colors"
                title="واتساب"
              >
                <UIcon name="i-mdi-whatsapp" class="w-4 h-4" />
              </a>

              <UButton
                size="xs"
                :color="isRowExpanded(b.id) ? 'amber' : 'gray'"
                :variant="isRowExpanded(b.id) ? 'solid' : 'soft'"
                class="rounded-xl font-bold"
                @click="toggleRow(b.id)"
              >
                <span>{{ isRowExpanded(b.id) ? 'إخفاء' : 'تفاصيل' }}</span>
              </UButton>

              <UButton
                size="xs"
                color="red"
                variant="ghost"
                icon="i-mdi-trash-can-outline"
                class="rounded-xl"
                @click="promptDelete(b, 'bookings')"
                title="حذف الحجز (Soft Delete)"
              />
            </div>
          </div>

          <!-- Expanded Details for Direct Booking -->
          <div
            v-if="isRowExpanded(b.id)"
            class="p-5 bg-stone-50/90 dark:bg-stone-950/70 border-t border-stone-200 dark:border-stone-800 space-y-4 animate-fade-in"
          >
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div class="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-0.5">
                <span class="text-stone-400 block">الاسم:</span>
                <span class="font-bold text-stone-900 dark:text-stone-100">{{ b.guestName }}</span>
              </div>
              <div class="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-0.5">
                <span class="text-stone-400 block">الجوال:</span>
                <a :href="`tel:${b.guestPhone}`" class="font-bold text-stone-900 dark:text-stone-100 font-mono" dir="ltr">{{ b.guestPhone }}</a>
              </div>
              <div class="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-0.5">
                <span class="text-stone-400 block">البريد الإلكتروني:</span>
                <span class="font-bold text-stone-900 dark:text-stone-100">{{ b.guestEmail || '-' }}</span>
              </div>
              <div class="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-0.5">
                <span class="text-stone-400 block">تاريخ العملية:</span>
                <span class="font-bold text-stone-900 dark:text-stone-100">{{ b.createdDateString || '-' }}</span>
              </div>
            </div>

            <div class="flex items-center justify-between gap-3 pt-2 border-t border-stone-200 dark:border-stone-800">
              <div class="flex items-center gap-2">
                <span class="text-xs text-stone-500">حالة السداد:</span>
                <UBadge :color="b.status === 'paid' ? 'emerald' : 'amber'" size="xs">
                  {{ b.status === 'paid' ? 'سداد مكتمل (Moyasar)' : 'قيد المعالجة' }}
                </UBadge>
              </div>

              <div class="flex items-center gap-2">
                <ULink
                  :to="`/booking/${b.id}`"
                  target="_blank"
                  class="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <UIcon name="i-mdi-printer" class="w-4 h-4" />
                  <span>طباعة مستند الحجز الرسمي</span>
                </ULink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Soft Delete Confirmation Dialog Modal -->
    <UModal v-model="isDeleteModalOpen" :ui="{ width: 'sm:max-w-md' }">
      <div v-if="itemToDelete" class="p-6 space-y-4 bg-white dark:bg-stone-900 rounded-2xl">
        <div class="flex items-center gap-3 text-red-500">
          <div class="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center font-bold text-xl shrink-0">
            <UIcon name="i-mdi-trash-can-alert-outline" class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-base font-bold text-stone-900 dark:text-stone-100">
              تأكيد حذف سجل الحجز
            </h3>
            <p class="text-xs text-stone-500">سيتم أرشفة السجل وحذفه بأمان (Soft Delete)</p>
          </div>
        </div>

        <div class="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-stone-700 dark:text-stone-300 space-y-2">
          <p class="font-semibold text-stone-900 dark:text-stone-100">
            هل أنت متأكد من رغبتك في حذف طلب الحجز الخاص بالضيف <strong class="text-red-600">"{{ itemToDelete.name || itemToDelete.guestName }}"</strong>؟
          </p>
          <div class="p-2.5 rounded-lg bg-white/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 space-y-1 text-[11px]">
            <div class="text-stone-800 dark:text-stone-200 font-bold">
              🏨 المنشأة / الوحدة: {{ itemToDelete.object || itemToDelete.itemNameAr }}
            </div>
            <div v-if="itemToDelete.phone || itemToDelete.guestPhone" class="text-stone-600 dark:text-stone-400 font-mono" dir="ltr">
              📱 الجوال: {{ itemToDelete.phone || itemToDelete.guestPhone }}
            </div>
            <div v-if="itemToDelete.checkIn" class="text-stone-500">
              📅 الإقامة: {{ itemToDelete.checkIn }} إلى {{ itemToDelete.checkOut }}
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { collection, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useCollection, useFirestore } from "vuefire";

const db = useFirestore();
const toast = useToast();

const activeSubTab = ref<"form_requests" | "direct_paid">("form_requests");
const searchQuery = ref("");
const selectedStatus = ref("all");

// Expanded Rows Tracker (Set of document IDs)
const expandedRowIds = ref<Record<string, boolean>>({});

const isRowExpanded = (id: string) => {
  return !!expandedRowIds.value[id];
};

const toggleRow = (id: string) => {
  expandedRowIds.value[id] = !expandedRowIds.value[id];
};

// Soft Delete Modal State
const isDeleteModalOpen = ref(false);
const itemToDelete = ref<any>(null);
const targetCollection = ref<"messages" | "bookings">("messages");
const isDeleting = ref(false);

// Fetch messages collection for booking_request type
const messagesRef = collection(db, "messages");
const { data: messagesList, pending: pendingMessages } = useCollection(messagesRef);

// Fetch direct paid bookings
const bookingsRef = collection(db, "bookings");
const { data: directBookingsList, pending: pendingBookings } = useCollection(bookingsRef);

// 1. Clean Booking Requests (excluding soft-deleted)
const bookingRequests = computed(() => {
  if (!messagesList.value) return [];
  return messagesList.value.filter((m: any) => m.type === "booking_request" && !m.isDeleted && !m.deleted);
});

// 2. Clean Direct Bookings (excluding soft-deleted)
const directBookingsListClean = computed(() => {
  if (!directBookingsList.value) return [];
  return directBookingsList.value.filter((b: any) => !b.isDeleted && !b.deleted);
});

const statusFilterOptions = [
  { label: "الكل", value: "all" },
  { label: "طلب جديد", value: "new" },
  { label: "تم التواصل", value: "contacted" },
  { label: "حجز مؤكد", value: "confirmed" },
  { label: "ملغي", value: "cancelled" },
];

const directStatusFilterOptions = [
  { label: "الكل", value: "all" },
  { label: "مدفوع (PAID)", value: "paid" },
  { label: "قيد السداد", value: "pending" },
];

const getStatusCount = (status: string) => {
  if (!bookingRequests.value) return 0;
  if (status === "all") return bookingRequests.value.length;
  if (status === "new") return bookingRequests.value.filter((m: any) => !m.status || m.status === "new").length;
  return bookingRequests.value.filter((m: any) => m.status === status).length;
};

const getDirectStatusCount = (status: string) => {
  if (!directBookingsListClean.value) return 0;
  if (status === "all") return directBookingsListClean.value.length;
  return directBookingsListClean.value.filter((b: any) => (b.status || "paid") === status).length;
};

const filteredBookingRequests = computed(() => {
  if (!bookingRequests.value) return [];
  let list = bookingRequests.value;

  // Filter by status
  if (selectedStatus.value !== "all") {
    if (selectedStatus.value === "new") {
      list = list.filter((m: any) => !m.status || m.status === "new");
    } else {
      list = list.filter((m: any) => m.status === selectedStatus.value);
    }
  }

  if (!searchQuery.value.trim()) return list;

  const q = searchQuery.value.toLowerCase().trim();
  return list.filter((m: any) => {
    return (
      (m.name && m.name.toLowerCase().includes(q)) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.phone && m.phone.toLowerCase().includes(q)) ||
      (m.object && m.object.toLowerCase().includes(q)) ||
      (m.message && m.message.toLowerCase().includes(q))
    );
  });
});

const truncateMessage = (text?: string, maxLen = 120) => {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen) + "...";
};

const filteredDirectBookings = computed(() => {
  if (!directBookingsListClean.value) return [];
  let list = directBookingsListClean.value;

  // Filter by status
  if (selectedStatus.value !== "all") {
    list = list.filter((b: any) => (b.status || "paid") === selectedStatus.value);
  }

  if (!searchQuery.value.trim()) return list;

  const q = searchQuery.value.toLowerCase().trim();
  return list.filter((b: any) => {
    return (
      (b.id && b.id.toLowerCase().includes(q)) ||
      (b.guestName && b.guestName.toLowerCase().includes(q)) ||
      (b.guestPhone && b.guestPhone.toLowerCase().includes(q)) ||
      (b.guestEmail && b.guestEmail.toLowerCase().includes(q)) ||
      (b.itemNameAr && b.itemNameAr.toLowerCase().includes(q))
    );
  });
});

const filteredListCount = computed(() => {
  return activeSubTab.value === "form_requests"
    ? filteredBookingRequests.value.length
    : filteredDirectBookings.value.length;
});

const isAllExpanded = computed(() => {
  const currentList = activeSubTab.value === "form_requests" ? filteredBookingRequests.value : filteredDirectBookings.value;
  if (currentList.length === 0) return false;
  return currentList.every((item: any) => !!expandedRowIds.value[item.id]);
});

const toggleAllRows = () => {
  const currentList = activeSubTab.value === "form_requests" ? filteredBookingRequests.value : filteredDirectBookings.value;
  const targetState = !isAllExpanded.value;
  currentList.forEach((item: any) => {
    expandedRowIds.value[item.id] = targetState;
  });
};

const statusOptions = [
  { label: "جديد (New)", value: "new" },
  { label: "تم التواصل (Contacted)", value: "contacted" },
  { label: "مؤكد (Confirmed)", value: "confirmed" },
  { label: "ملغي (Cancelled)", value: "cancelled" },
];

const getStatusLabel = (status?: string) => {
  switch (status) {
    case "contacted":
      return "تم التواصل";
    case "confirmed":
      return "حجز مؤكد";
    case "cancelled":
      return "ملغي";
    default:
      return "طلب جديد";
  }
};

const getStatusClass = (status?: string) => {
  switch (status) {
    case "contacted":
      return "bg-blue-500/20 text-blue-700 dark:text-blue-300";
    case "confirmed":
      return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300";
    case "cancelled":
      return "bg-red-500/20 text-red-700 dark:text-red-300";
    default:
      return "bg-amber-500/20 text-amber-700 dark:text-amber-300";
  }
};

const getWhatsAppLink = (req: any) => {
  const cleanPhone = (req.phone || "").replace(/[^0-9]/g, "");
  const text = `السلام عليكم أخي الكريم ${req.name}، بخصوص طلب الحجز المقدم في مؤسسة بروج المميزة للسياحة (${req.object || ''})... يسعدنا تأكيد حجزكم وخدمتكم.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};

const updateStatus = async (id: string, newStatus: string) => {
  try {
    await updateDoc(doc(db, "messages", id), { status: newStatus });
    toast.add({
      title: "تم تحديث حالة الطلب",
      color: "emerald",
      icon: "i-mdi-check-circle",
    });
  } catch (err: any) {
    console.error("Failed to update status:", err);
    toast.add({
      title: "فشل التحديث",
      description: err?.message,
      color: "red",
      icon: "i-mdi-alert-circle",
    });
  }
};

const promptDelete = (item: any, collectionName: "messages" | "bookings") => {
  itemToDelete.value = item;
  targetCollection.value = collectionName;
  isDeleteModalOpen.value = true;
};

const confirmSoftDelete = async () => {
  if (!itemToDelete.value) return;

  try {
    isDeleting.value = true;
    await updateDoc(doc(db, targetCollection.value, itemToDelete.value.id), {
      isDeleted: true,
      deletedAt: serverTimestamp(),
    });

    toast.add({
      title: "تم حذف السجل بنجاح (حذف آمن)",
      description: "تمت أرشفة السجل وإزالته من القائمة.",
      color: "emerald",
      icon: "i-mdi-check-circle",
    });

    isDeleteModalOpen.value = false;
    itemToDelete.value = null;
  } catch (err: any) {
    console.error("Failed to soft delete:", err);
    toast.add({
      title: "فشل الحذف",
      description: err?.message,
      color: "red",
      icon: "i-mdi-alert-circle",
    });
  } finally {
    isDeleting.value = false;
  }
};
</script>
