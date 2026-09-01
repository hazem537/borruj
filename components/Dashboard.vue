<template>
  <div class="min-h-[85vh] flex flex-col">
    <!-- Top Bar with Stats & Language Mode Indicators -->
    <header class="glass-panel p-4 md:p-6 rounded-3xl mb-6 flex flex-wrap items-center justify-between gap-4 border border-stone-200 dark:border-stone-800 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-2xl">
          <UIcon name="i-mdi-shield-crown-outline" class="w-7 h-7" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl md:text-2xl font-black text-stone-900 dark:text-stone-100">
              لوحة التحكم الإدارية والنظامية
            </h1>
            <UBadge color="emerald" variant="subtle" size="xs">متوافق مع وزارة السياحة</UBadge>
          </div>
          <p class="text-xs text-stone-500 dark:text-stone-400">
            مؤسسة بروج المميزة للسياحة | ترخيص رقم: <strong class="font-mono text-amber-600">{{ form.legal.licenseNumber }}</strong>
          </p>
        </div>
      </div>

        <!-- Quick Operations Status Bar -->
      <div class="flex items-center gap-3">
        <div class="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
          <UIcon name="i-mdi-credit-card-outline" class="w-4 h-4 text-amber-500" />
          <span>بوابة السداد الإلكتروني:</span>
          <span :class="form.features.enableDirectPayment ? 'text-emerald-500 font-bold' : 'text-stone-400'">
            {{ form.features.enableDirectPayment ? 'مفعّلة (Live/Sandbox)' : 'معطلة مؤقتاً' }}
          </span>
        </div>

        <UButton
          color="amber"
          variant="solid"
          size="md"
          :loading="isSaving"
          @click="handleSave"
          class="font-bold rounded-xl shadow-md hover:shadow-amber-500/30 transition-all"
        >
          <template #leading>
            <UIcon name="i-mdi-content-save-check" />
          </template>
          حفظ التعديلات
        </UButton>
      </div>
    </header>

    <!-- Main Layout: Vertical Navigation Tabs + Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- VERTICAL SIDEBAR NAVIGATION (3 cols) -->
      <aside class="lg:col-span-3 space-y-4">
        <!-- Operational Section Tabs -->
        <div class="glass-panel p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <div class="px-3 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            العمليات والطلبات الواردة
          </div>
          <button
            v-for="tab in operationTabs"
            :key="tab.id"
            type="button"
            @click="activeMainTab = tab.id"
            class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-right"
            :class="activeMainTab === tab.id
              ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'"
          >
            <div class="flex items-center gap-2.5">
              <UIcon :name="tab.icon" class="w-4 h-4" />
              <span>{{ tab.label }}</span>
            </div>
            <UBadge v-if="tab.badge" :color="activeMainTab === tab.id ? 'black' : 'amber'" size="2xs" variant="subtle">
              {{ tab.badge }}
            </UBadge>
          </button>
        </div>

        <!-- CMS Content Sections Tabs -->
        <div class="glass-panel p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <div class="px-3 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            إدارة المحتوى وتراخيص الموقع
          </div>
          <button
            v-for="tab in contentTabs"
            :key="tab.id"
            type="button"
            @click="activeMainTab = tab.id"
            class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-right"
            :class="activeMainTab === tab.id
              ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'"
          >
            <div class="flex items-center gap-2.5">
              <UIcon :name="tab.icon" class="w-4 h-4" />
              <span>{{ tab.label }}</span>
            </div>
            <UIcon name="i-mdi-chevron-left" class="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>
      </aside>

      <!-- CONTENT EDITING AREA (9 cols) -->
      <main class="lg:col-span-9">
        <div class="glass-panel p-6 md:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl space-y-6">
          <!-- Section Title & Inner Language Switcher (AR/EN) -->
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
            <div class="flex items-center gap-2">
              <UIcon :name="currentTabMeta.icon" class="w-6 h-6 text-amber-500" />
              <div>
                <h2 class="text-lg md:text-xl font-bold text-stone-900 dark:text-stone-100">
                  {{ currentTabMeta.label }}
                </h2>
                <p class="text-xs text-stone-500 dark:text-stone-400">
                  {{ currentTabMeta.desc }}
                </p>
              </div>
            </div>

            <!-- Inner Language Tabs Switcher (Only on bilingual content tabs) -->
            <div
              v-if="currentTabMeta.hasBilingual"
              class="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700"
            >
              <button
                type="button"
                @click="innerLangTab = 'ar'"
                class="px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                :class="innerLangTab === 'ar' ? 'bg-amber-500 text-stone-950 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'"
              >
                <span>🇸🇦</span>
                <span>المحتوى العربي (AR)</span>
              </button>
              <button
                type="button"
                @click="innerLangTab = 'en'"
                class="px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                :class="innerLangTab === 'en' ? 'bg-amber-500 text-stone-950 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'"
              >
                <span>🇬🇧</span>
                <span>English (EN)</span>
              </button>
            </div>
          </div>

          <!-- TAB CONTENT: BOOKINGS & DIRECT PAYMENTS -->
          <div v-if="activeMainTab === 'bookings'">
            <BookingsList />
          </div>

          <!-- TAB CONTENT: MESSAGES & COMPLAINTS -->
          <div v-else-if="activeMainTab === 'messages'">
            <Messages />
          </div>

          <!-- TAB CONTENT: LEGAL & LICENSES (Compliance Article 18 & 22) -->
          <div v-else-if="activeMainTab === 'legal'" class="space-y-6">
            <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-stone-700 dark:text-stone-300 space-y-1">
              <span class="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <UIcon name="i-mdi-shield-alert-outline" />
                <span>متطلبات الهوية النظامية (المادة الثامنة عشرة - الفقرة 2):</span>
              </span>
              <p>يجب إبراز الاسم التجاري ورقم السجل ورقم ترخيص وزارة السياحة وفئته بدقة في كامل صفحات ومنصات المنشأة.</p>
            </div>

            <!-- Enable Direct Payment Feature Switch -->
            <div class="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100">تفعيل الدفع الائتماني المباشر (فيزا وماستركارد)</h4>
                <p class="text-xs text-stone-500">
                  عند التعطيل، يتم توجيه العملاء إلى نموذج طلب الحجز أو محادثة الواتساب المباشرة.
                </p>
              </div>
              <UToggle v-model="form.features.enableDirectPayment" size="lg" color="amber" />
            </div>

            <!-- ARABIC INNER TAB -->
            <div v-if="innerLangTab === 'ar'" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="الاسم التجاري للمنشأة (عربي)" required>
                  <UInput v-model="form.legal.tradeName" size="md" />
                </UFormGroup>
                <UFormGroup label="فئة وتصنيف الترخيص (عربي)" required>
                  <UInput v-model="form.legal.licenseCategory" size="md" />
                </UFormGroup>
              </div>
            </div>

            <!-- ENGLISH INNER TAB -->
            <div v-else class="space-y-4" dir="ltr">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="Trade Name (English)" required>
                  <UInput v-model="form.legal.tradeNameEn" size="md" />
                </UFormGroup>
                <UFormGroup label="License Category (English)" required>
                  <UInput v-model="form.legal.licenseCategoryEn" size="md" />
                </UFormGroup>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-200 dark:border-stone-800">
              <UFormGroup label="رقم السجل التجاري (CR Number)" required>
                <UInput v-model="form.legal.crNumber" size="md" dir="ltr" />
              </UFormGroup>
              <UFormGroup label="رقم ترخيص وزارة السياحة (Tourism License)" required>
                <UInput v-model="form.legal.licenseNumber" size="md" dir="ltr" />
              </UFormGroup>
            </div>
          </div>

          <!-- TAB CONTENT: SUPPORT & COMPLAINTS 24/7 (Compliance Article 18-3 & Article 22-1/A) -->
          <div v-else-if="activeMainTab === 'support'" class="space-y-6">
            <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-stone-700 dark:text-stone-300 space-y-1">
              <span class="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <UIcon name="i-mdi-clock-check-outline" />
                <span>الامتثال للدعم المتواصل (24/7) وسرعة البت في الشكاوى:</span>
              </span>
              <p>توفير وسيلة اتصال وتواصل معتمدة على مدار الساعة للرد على الاستفسارات والبت في الشكاوى خلال 24 ساعة كحد أقصى.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UFormGroup label="هاتف الدعم المباشر (24/7)" required>
                <UInput v-model="form.support.phone" size="md" dir="ltr" />
              </UFormGroup>
              <UFormGroup label="رقم واتساب الاستفسارات والشكاوى" required>
                <UInput v-model="form.support.whatsapp" size="md" dir="ltr" />
              </UFormGroup>
              <UFormGroup label="بريد الشكاوى الرسمي" required>
                <UInput v-model="form.support.complaintsEmail" type="email" size="md" dir="ltr" />
              </UFormGroup>
            </div>

            <!-- ARABIC INNER TAB -->
            <div v-if="innerLangTab === 'ar'" class="space-y-4">
              <UFormGroup label="إقرار التوفر والتواصل 24/7 (عربي)">
                <UTextarea v-model="form.support.support24_7Note" :rows="3" />
              </UFormGroup>
            </div>

            <!-- ENGLISH INNER TAB -->
            <div v-else class="space-y-4" dir="ltr">
              <UFormGroup label="24/7 Support & Care Commitment (English)">
                <UTextarea v-model="form.support.support24_7NoteEn" :rows="3" />
              </UFormGroup>
            </div>

            <UFormGroup label="الحد الأقصى للرد والبت في الشكاوى (بالساعات - نظامياً 24 ساعة)" class="max-w-xs">
              <UInput v-model.number="form.support.complaintsSlaHours" type="number" size="md" dir="ltr" />
            </UFormGroup>
          </div>

          <!-- TAB CONTENT: HERO SECTION (With Inner AR/EN tabs) -->
          <div v-else-if="activeMainTab === 'hero'" class="space-y-6">
            <!-- ARABIC INNER TAB -->
            <div v-if="innerLangTab === 'ar'" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="مقدمة الترحيب (عربي)">
                  <UInput v-model="form.hero.welcomePrefix" size="md" />
                </UFormGroup>
                <UFormGroup label="اسم العلامة التجارية (عربي)">
                  <UInput v-model="form.hero.brandName" size="md" />
                </UFormGroup>
              </div>
              <UFormGroup label="العنوان الفرعي للواجهة (عربي)">
                <UInput v-model="form.hero.subtitle" size="md" />
              </UFormGroup>
              <UFormGroup label="نص الشارة العلوية (عربي)">
                <UInput v-model="form.hero.badgeText" size="md" />
              </UFormGroup>
              <UFormGroup label="نص البنر الترويجي (عربي)">
                <UInput v-model="form.hero.offerText" size="md" />
              </UFormGroup>
            </div>

            <!-- ENGLISH INNER TAB -->
            <div v-else class="space-y-4" dir="ltr">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="Welcome Prefix (English)">
                  <UInput v-model="form.hero.welcomePrefixEn" size="md" />
                </UFormGroup>
                <UFormGroup label="Brand Name (English)">
                  <UInput v-model="form.hero.brandNameEn" size="md" />
                </UFormGroup>
              </div>
              <UFormGroup label="Subtitle (English)">
                <UInput v-model="form.hero.subtitleEn" size="md" />
              </UFormGroup>
              <UFormGroup label="Badge Text (English)">
                <UInput v-model="form.hero.badgeTextEn" size="md" />
              </UFormGroup>
              <UFormGroup label="Offer Banner Text (English)">
                <UInput v-model="form.hero.offerTextEn" size="md" />
              </UFormGroup>
            </div>

            <div class="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100">إظهار شريط العرض الخاص</h4>
                <p class="text-xs text-stone-500">عرض شريط مميز أعلى الصفحة بالعروض الحالية</p>
              </div>
              <UToggle v-model="form.hero.showOffer" size="lg" color="amber" />
            </div>
          </div>

          <!-- TAB CONTENT: ABOUT US (With Inner AR/EN tabs) -->
          <div v-else-if="activeMainTab === 'about'" class="space-y-6">
            <!-- ARABIC INNER TAB -->
            <div v-if="innerLangTab === 'ar'" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="عنوان القسم (عربي)">
                  <UInput v-model="form.about.title" size="md" />
                </UFormGroup>
                <UFormGroup label="شارة القسم (عربي)">
                  <UInput v-model="form.about.badge" size="md" />
                </UFormGroup>
              </div>
              <UFormGroup label="المحتوى التعريفي (المحرر الغني - عربي)">
                <RichEditor v-model="form.about.contentHtml" dir="rtl" />
              </UFormGroup>
            </div>

            <!-- ENGLISH INNER TAB -->
            <div v-else class="space-y-4" dir="ltr">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="Section Title (English)">
                  <UInput v-model="form.about.titleEn" size="md" />
                </UFormGroup>
                <UFormGroup label="Section Badge (English)">
                  <UInput v-model="form.about.badgeEn" size="md" />
                </UFormGroup>
              </div>
              <UFormGroup label="About Us Content (Rich Editor - English)">
                <RichEditor v-model="form.about.contentHtmlEn" dir="ltr" />
              </UFormGroup>
            </div>
          </div>

          <!-- TAB CONTENT: HOTELS (Clean Structured Rows with Name, City, Truncated Desc & 3 Actions) -->
          <div v-else-if="activeMainTab === 'hotels'" class="space-y-6">
            <!-- ARABIC INNER TAB -->
            <div v-if="innerLangTab === 'ar'" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="عنوان القسم (عربي)">
                  <UInput v-model="form.hotelsServices.title" size="md" />
                </UFormGroup>
                <UFormGroup label="شارة القسم (عربي)">
                  <UInput v-model="form.hotelsServices.badge" size="md" />
                </UFormGroup>
              </div>
              <UFormGroup label="الوصف التمهيدي (عربي)">
                <UInput v-model="form.hotelsServices.subtitle" size="md" />
              </UFormGroup>
              <UFormGroup label="المحتوى التعريفي بالضيافة والخدمات (عربي)">
                <RichEditor v-model="form.hotelsServices.contentHtml" dir="rtl" />
              </UFormGroup>
            </div>

            <!-- ENGLISH INNER TAB -->
            <div v-else class="space-y-4" dir="ltr">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="Unified Section Title (English)">
                  <UInput v-model="form.hotelsServices.titleEn" size="md" />
                </UFormGroup>
                <UFormGroup label="Section Badge (English)">
                  <UInput v-model="form.hotelsServices.badgeEn" size="md" />
                </UFormGroup>
              </div>
              <UFormGroup label="Subtitle (English)">
                <UInput v-model="form.hotelsServices.subtitleEn" size="md" />
              </UFormGroup>
              <UFormGroup label="Hospitality Services Intro (English)">
                <RichEditor v-model="form.hotelsServices.contentHtmlEn" dir="ltr" />
              </UFormGroup>
            </div>

            <!-- Hotels Row-Based Management Table -->
            <div class="pt-6 border-t border-stone-200 dark:border-stone-800 space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 class="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <UIcon name="i-mdi-office-building-cog" class="text-amber-500" />
                    <span>سجل الفنادق والمرافق المرخصة</span>
                    <UBadge color="amber" variant="subtle" size="xs">{{ form.hotelsServices.items?.length || 0 }}</UBadge>
                  </h3>
                  <p class="text-xs text-stone-500">إدارة منشآت الإقامة وتصاريحها؛ تُربط باقات الأسعار والغرف مباشرة بهذه الفنادق</p>
                </div>
                <UButton size="sm" color="amber" icon="i-mdi-plus" @click="openAddHotelModal" class="rounded-xl font-bold">
                  إضافة فندق جديد
                </UButton>
              </div>

              <!-- Structured Hotel Rows Table -->
              <div v-if="form.hotelsServices.items && form.hotelsServices.items.length > 0" class="space-y-2">
                <!-- Table Header Columns -->
                <div class="hidden md:grid grid-cols-12 gap-3 px-4 py-2 text-[11px] font-bold text-stone-400 uppercase tracking-wider bg-stone-100/70 dark:bg-stone-800/50 rounded-xl">
                  <div class="col-span-4">اسم الفندق / المنشأة</div>
                  <div class="col-span-2">المدينة</div>
                  <div class="col-span-3">نبذة مختصرة</div>
                  <div class="col-span-3 text-center">الإجراءات</div>
                </div>

                <!-- Hotel Rows -->
                <div
                  v-for="(hotel, idx) in form.hotelsServices.items"
                  :key="hotel.id || idx"
                  class="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 hover:border-amber-500/40 hover:shadow-md transition-all grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                >
                  <!-- Col 1: Name & Image & Permit (4 cols) -->
                  <div class="col-span-1 md:col-span-4 flex items-center gap-3">
                    <img
                      v-if="hotel.image"
                      :src="hotel.image"
                      :alt="hotel.name"
                      class="w-12 h-12 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                    />
                    <div v-else class="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold shrink-0">
                      <UIcon name="i-mdi-office-building" class="w-6 h-6" />
                    </div>

                    <div class="space-y-0.5 min-w-0">
                      <h4 class="font-bold text-sm text-stone-900 dark:text-stone-100 truncate" :title="hotel.name">
                        {{ hotel.name }}
                      </h4>
                      <p v-if="hotel.nameEn" class="text-[11px] text-stone-400 font-sans truncate" dir="ltr" :title="hotel.nameEn">
                        {{ hotel.nameEn }}
                      </p>
                      <span class="inline-block text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {{ hotel.permitNumber || 'بدون تصريح' }}
                      </span>
                    </div>
                  </div>

                  <!-- Col 2: City (2 cols) -->
                  <div class="col-span-1 md:col-span-2 flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300">
                    <UIcon name="i-mdi-map-marker-outline" class="w-4 h-4 text-amber-500 shrink-0" />
                    <span class="font-semibold">{{ hotel.city || 'مكة المكرمة' }}</span>
                    <a
                      v-if="hotel.googleMapsUrl"
                      :href="hotel.googleMapsUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="p-1 rounded-md text-emerald-600 hover:bg-emerald-500/10 transition-colors inline-flex items-center"
                      title="فتح الموقع على خرائط جوجل"
                    >
                      <UIcon name="i-mdi-google-maps" class="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <!-- Col 3: Description (Truncated ~30 chars) (3 cols) -->
                  <div class="col-span-1 md:col-span-3 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    <span class="md:hidden font-bold text-stone-700 dark:text-stone-300 ml-1">الوصف:</span>
                    <span>{{ getTruncatedDesc(hotel.description, 30) }}</span>
                  </div>

                  <!-- Col 4: 3 Actions (Preview, Edit, Delete) (3 cols) -->
                  <div class="col-span-1 md:col-span-3 flex items-center justify-end gap-1.5 pt-2 md:pt-0 border-t md:border-t-0 border-stone-200 dark:border-stone-800">
                    <!-- 1. PREVIEW ACTION -->
                    <UButton
                      size="xs"
                      color="gray"
                      variant="solid"
                      icon="i-mdi-eye-outline"
                      class="rounded-xl font-bold"
                      @click="openPreviewHotelModal(hotel)"
                      title="معاينة تفاصيل الفندق (عربي وإنجليزي)"
                    >
                      <span class="hidden sm:inline">معاينة</span>
                    </UButton>

                    <!-- 2. EDIT ACTION -->
                    <UButton
                      size="xs"
                      color="amber"
                      variant="soft"
                      icon="i-mdi-pencil-outline"
                      class="rounded-xl font-bold"
                      @click="openEditHotelModal(idx)"
                      title="تعديل بيانات الفندق"
                    >
                      <span class="hidden sm:inline">تعديل</span>
                    </UButton>

                    <!-- 3. DELETE ACTION -->
                    <UButton
                      size="xs"
                      color="red"
                      variant="ghost"
                      icon="i-mdi-trash-can-outline"
                      class="rounded-xl"
                      @click="promptDeleteHotel(idx)"
                      title="حذف الفندق وباقاته السعرية"
                    />
                  </div>
                </div>
              </div>

              <!-- Empty Hotels -->
              <div v-else class="text-center py-8 px-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-dashed border-stone-200 dark:border-stone-800">
                <UIcon name="i-mdi-office-building-plus" class="w-10 h-10 text-stone-400 mx-auto mb-2" />
                <p class="text-xs text-stone-500">لا توجد فنادق مسجلة حالياً. اضغط على "إضافة فندق جديد" للبدء.</p>
              </div>
            </div>
          </div>

          <!-- TAB CONTENT: PRICE LIST & ROOMS (Clean Row View + Modal Form Linked to Hotels) -->
          <div v-else-if="activeMainTab === 'prices'" class="space-y-6">
            <!-- ARABIC INNER TAB -->
            <div v-if="innerLangTab === 'ar'" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="عنوان قائمة الأسعار (عربي)">
                  <UInput v-model="form.prices.titleAr" size="md" />
                </UFormGroup>
                <UFormGroup label="شارة قائمة الأسعار (عربي)">
                  <UInput v-model="form.prices.badgeAr" size="md" />
                </UFormGroup>
              </div>
              <UFormGroup label="العنوان الفرعي وإقرار الضريبة (عربي)">
                <UInput v-model="form.prices.subtitleAr" size="md" />
              </UFormGroup>
            </div>

            <!-- ENGLISH INNER TAB -->
            <div v-else class="space-y-4" dir="ltr">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="Price List Title (English)">
                  <UInput v-model="form.prices.titleEn" size="md" />
                </UFormGroup>
                <UFormGroup label="Price List Badge (English)">
                  <UInput v-model="form.prices.badgeEn" size="md" />
                </UFormGroup>
              </div>
              <UFormGroup label="Subtitle & Statutory VAT Statement (English)">
                <UInput v-model="form.prices.subtitleEn" size="md" />
              </UFormGroup>
            </div>

            <!-- Price Items Row-Based Management Table -->
            <div class="pt-6 border-t border-stone-200 dark:border-stone-800 space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 class="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <UIcon name="i-mdi-tag-multiple-outline" class="text-amber-500" />
                    <span>باقات وأسعار الغرف والخدمات (المرتبطة بالفنادق)</span>
                    <UBadge color="amber" variant="subtle" size="xs">{{ form.prices.items?.length || 0 }}</UBadge>
                  </h3>
                  <p class="text-xs text-stone-500">
                    أسعار شاملة 15% ضريبة؛ مرتبطة بالفنادق المرخصة وترث رقم التصريح تلقائياً.
                  </p>
                </div>
                <UButton size="sm" color="amber" icon="i-mdi-plus" @click="openAddPriceModal" class="rounded-xl font-bold">
                  إضافة باقة سعرية جديدة
                </UButton>
              </div>

              <!-- Price Items Rows -->
              <div v-if="form.prices.items && form.prices.items.length > 0" class="space-y-3">
                <div
                  v-for="(price, idx) in form.prices.items"
                  :key="price.id || idx"
                  class="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-amber-500/40 transition-all group"
                >
                  <div class="space-y-1.5 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span v-if="getHotelNameForPrice(price)" class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                        🏨 {{ getHotelNameForPrice(price) }}
                      </span>
                      <h4 class="font-bold text-sm text-stone-900 dark:text-stone-100">
                        {{ price.nameAr }}
                      </h4>
                      <span v-if="price.nameEn" class="text-xs text-stone-400 font-sans" dir="ltr">
                        ({{ price.nameEn }})
                      </span>
                      <span v-if="price.roomType" class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                        {{ price.roomType }}
                      </span>
                    </div>

                    <div class="flex items-center gap-3 text-xs text-stone-500 flex-wrap">
                      <span class="text-stone-700 dark:text-stone-300 font-medium">
                        {{ price.descriptionAr }}
                      </span>
                      <span class="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                        تصريح: {{ getPermitForPrice(price) }}
                      </span>
                    </div>
                  </div>

                  <div class="flex items-center gap-4 self-end md:self-center shrink-0">
                    <div class="text-left">
                      <span class="text-lg font-black text-amber-500 font-mono">{{ price.priceSar }}</span>
                      <span class="text-xs text-stone-600 dark:text-stone-400 font-semibold mr-1">ر.س</span>
                      <span class="text-[11px] text-stone-400 block">/ {{ price.unitAr || 'لليلة' }}</span>
                    </div>

                    <!-- Row Actions -->
                    <div class="flex items-center gap-1.5">
                      <UButton
                        size="xs"
                        color="amber"
                        variant="soft"
                        icon="i-mdi-pencil-outline"
                        class="rounded-xl font-bold"
                        @click="openEditPriceModal(idx)"
                      >
                        تعديل
                      </UButton>
                      <UButton
                        size="xs"
                        color="red"
                        variant="ghost"
                        icon="i-mdi-trash-can-outline"
                        class="rounded-xl"
                        @click="promptDeletePrice(idx)"
                        title="حذف الباقة السعرية"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty Prices -->
              <div v-else class="text-center py-8 px-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-dashed border-stone-200 dark:border-stone-800">
                <UIcon name="i-mdi-tag-plus" class="w-10 h-10 text-stone-400 mx-auto mb-2" />
                <p class="text-xs text-stone-500">لا توجد باقات سعرية حالياً. اضغط على "إضافة باقة سعرية جديدة" للبدء.</p>
              </div>
            </div>
          </div>

          <!-- TAB CONTENT: STATUTORY POLICIES (With Inner AR/EN tabs) -->
          <div v-else-if="activeMainTab === 'policies'" class="space-y-6">
            <!-- SLAs Configuration -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
              <UFormGroup label="مدة الرد والبت في طلبات الإلغاء (بالساعات - حد أقصى 24)">
                <UInput v-model.number="form.policies.cancelResponseHours" type="number" size="md" dir="ltr" />
              </UFormGroup>
              <UFormGroup label="المدة الزمنية لإعادة المبلغ للحساب (أيام عمل)">
                <UInput v-model.number="form.policies.refundExecutionDays" type="number" size="md" dir="ltr" />
              </UFormGroup>
            </div>

            <!-- ARABIC INNER TAB -->
            <div v-if="innerLangTab === 'ar'" class="space-y-6">
              <UFormGroup label="1. سياسة وشروط الحجز وإصدار المستند (عربي)">
                <RichEditor v-model="form.policies.bookingPolicyAr" dir="rtl" />
              </UFormGroup>
              <UFormGroup label="2. سياسة وإجراءات إلغاء وتعديل الحجز (عربي)">
                <RichEditor v-model="form.policies.cancellationPolicyAr" dir="rtl" />
              </UFormGroup>
              <UFormGroup label="3. سياسة مبالغ التأمين (عربي)">
                <RichEditor v-model="form.policies.insurancePolicyAr" dir="rtl" />
              </UFormGroup>
              <UFormGroup label="4. سياسة استرجاع المبالغ - المادة 23 (عربي)">
                <RichEditor v-model="form.policies.refundPolicyAr" dir="rtl" />
              </UFormGroup>
            </div>

            <!-- ENGLISH INNER TAB -->
            <div v-else class="space-y-6" dir="ltr">
              <UFormGroup label="1. Booking Terms & Confirmation Document Policy (English)">
                <RichEditor v-model="form.policies.bookingPolicyEn" dir="ltr" />
              </UFormGroup>
              <UFormGroup label="2. Cancellation & Modification Policy (English)">
                <RichEditor v-model="form.policies.cancellationPolicyEn" dir="ltr" />
              </UFormGroup>
              <UFormGroup label="3. Security Deposit Policy (English)">
                <RichEditor v-model="form.policies.insurancePolicyEn" dir="ltr" />
              </UFormGroup>
              <UFormGroup label="4. Statutory Refund Policy - Article 23 (English)">
                <RichEditor v-model="form.policies.refundPolicyEn" dir="ltr" />
              </UFormGroup>
            </div>
          </div>

          <!-- TAB CONTENT: CONTACT & HEADQUARTERS (With Inner AR/EN tabs) -->
          <div v-else-if="activeMainTab === 'contact'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UFormGroup label="الهاتف الرسمي">
                <UInput v-model="form.contact.phone" size="md" dir="ltr" />
              </UFormGroup>
              <UFormGroup label="واتساب المنشأة">
                <UInput v-model="form.contact.whatsapp" size="md" dir="ltr" />
              </UFormGroup>
              <UFormGroup label="البريد الإلكتروني">
                <UInput v-model="form.contact.email" type="email" size="md" dir="ltr" />
              </UFormGroup>
            </div>

            <!-- ARABIC INNER TAB -->
            <div v-if="innerLangTab === 'ar'" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="عنوان القسم (عربي)">
                  <UInput v-model="form.contact.title" size="md" />
                </UFormGroup>
                <UFormGroup label="شارة القسم (عربي)">
                  <UInput v-model="form.contact.badge" size="md" />
                </UFormGroup>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="الموقع والمقر (عربي)">
                  <UInput v-model="form.contact.location" size="md" />
                </UFormGroup>
                <UFormGroup label="أيام العمل (عربي)">
                  <UInput v-model="form.contact.workingDays" size="md" />
                </UFormGroup>
              </div>
              <UFormGroup label="ساعات العمل والرد على الاستفسارات (عربي)">
                <UInput v-model="form.contact.workingHours" size="md" />
              </UFormGroup>
              <UFormGroup label="الوصف التمهيدي (المحرر الغني - عربي)">
                <RichEditor v-model="form.contact.descriptionHtml" dir="rtl" />
              </UFormGroup>
            </div>

            <!-- ENGLISH INNER TAB -->
            <div v-else class="space-y-4" dir="ltr">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="Section Title (English)">
                  <UInput v-model="form.contact.titleEn" size="md" />
                </UFormGroup>
                <UFormGroup label="Section Badge (English)">
                  <UInput v-model="form.contact.badgeEn" size="md" />
                </UFormGroup>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="Headquarters Location (English)">
                  <UInput v-model="form.contact.locationEn" size="md" />
                </UFormGroup>
                <UFormGroup label="Working Days (English)">
                  <UInput v-model="form.contact.workingDaysEn" size="md" />
                </UFormGroup>
              </div>
              <UFormGroup label="Working Hours (English)">
                <UInput v-model="form.contact.workingHoursEn" size="md" />
              </UFormGroup>
              <UFormGroup label="Description (Rich Editor - English)">
                <RichEditor v-model="form.contact.descriptionHtmlEn" dir="ltr" />
              </UFormGroup>
            </div>

            <!-- Direct Bank Account Transfer Info -->
            <div class="pt-6 border-t border-stone-200 dark:border-stone-800 space-y-4">
              <h3 class="text-base font-bold text-stone-900 dark:text-stone-100">بيانات التحويل البنكي المباشر (اختياري)</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="اسم البنك">
                  <UInput v-model="form.contact.bankName" size="md" />
                </UFormGroup>
                <UFormGroup label="اسم صاحب الحساب">
                  <UInput v-model="form.contact.accountName" size="md" />
                </UFormGroup>
                <UFormGroup label="رقم الحساب">
                  <UInput v-model="form.contact.accountNumber" size="md" dir="ltr" />
                </UFormGroup>
                <UFormGroup label="رقم الآيبان الدولي (IBAN)">
                  <UInput v-model="form.contact.iban" size="md" dir="ltr" />
                </UFormGroup>
              </div>
            </div>
          </div>

          <!-- TAB CONTENT: SOCIAL MEDIA LINKS -->
          <div v-else-if="activeMainTab === 'socials'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormGroup label="رابط الواتساب">
                <UInput v-model="form.socials.whatsapp" size="md" dir="ltr" />
              </UFormGroup>
              <UFormGroup label="رابط الفيسبوك">
                <UInput v-model="form.socials.facebook" size="md" dir="ltr" />
              </UFormGroup>
              <UFormGroup label="رابط تويتر / X">
                <UInput v-model="form.socials.twitter" size="md" dir="ltr" />
              </UFormGroup>
              <UFormGroup label="رابط إنستغرام">
                <UInput v-model="form.socials.instagram" size="md" dir="ltr" />
              </UFormGroup>
              <UFormGroup label="رابط سناب شات">
                <UInput v-model="form.socials.snapchat" size="md" dir="ltr" />
              </UFormGroup>
            </div>
          </div>

          <!-- Bottom Sticky Save Action Bar -->
          <div class="pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4">
            <span class="text-xs text-stone-500">
              يتم حفظ التعديلات في قاعدة بيانات Firestore وتحديث الموقع مباشرة.
            </span>
            <UButton
              type="button"
              color="amber"
              size="lg"
              :loading="isSaving"
              @click="handleSave"
              class="font-bold px-8 rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all"
            >
              <template #leading>
                <UIcon name="i-mdi-content-save-check-outline" />
              </template>
              حفظ التعديلات الآن
            </UButton>
          </div>
        </div>
      </main>
    </div>

    <!-- 1. HOTEL MODAL FORM (EDIT / ADD) -->
    <UModal v-model="isHotelModalOpen" :ui="{ width: 'sm:max-w-2xl' }">
      <div class="p-6 space-y-4 bg-white dark:bg-stone-900 rounded-2xl">
        <div class="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <h3 class="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <UIcon name="i-mdi-office-building-cog" class="text-amber-500" />
            <span>{{ editingHotelIndex !== null ? 'تعديل بيانات فندق' : 'إضافة فندق مرخص جديد' }}</span>
          </h3>
          <UButton size="xs" color="gray" variant="ghost" icon="i-mdi-close" @click="isHotelModalOpen = false" />
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <UFormGroup label="اسم الفندق (عربي)" required>
              <UInput v-model="hotelModalForm.name" placeholder="مثال: فندق أبراج الصفوة" />
            </UFormGroup>
            <UFormGroup label="Hotel Name (English)">
              <UInput v-model="hotelModalForm.nameEn" dir="ltr" placeholder="Abraj Al Safwah Hotel" />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <UFormGroup label="رقم تصريح وزارة السياحة" required help="إلزامي لظهور الفندق في الموقع">
              <UInput v-model="hotelModalForm.permitNumber" dir="ltr" placeholder="73103970-MK-01" />
            </UFormGroup>
            <UFormGroup label="المدينة (عربي)">
              <UInput v-model="hotelModalForm.city" placeholder="مكة المكرمة / المدينة المنورة" />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <UFormGroup label="City (English)">
              <UInput v-model="hotelModalForm.cityEn" dir="ltr" placeholder="Makkah / Madinah" />
            </UFormGroup>
            <UFormGroup label="رابط صورة الفندق">
              <UInput v-model="hotelModalForm.image" dir="ltr" placeholder="/9.jpeg أو رابط مباشر" />
            </UFormGroup>
          </div>

          <UFormGroup label="رابط الموقع على خرائط جوجل (Google Maps URL)" help="مثال: https://maps.google.com/?q=Hotel+Name">
            <UInput v-model="hotelModalForm.googleMapsUrl" dir="ltr" placeholder="https://maps.google.com/?q=..." icon="i-mdi-google-maps" />
          </UFormGroup>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <UFormGroup label="الوصف والمميزات (عربي)">
              <UTextarea v-model="hotelModalForm.description" :rows="2" placeholder="إقامة فاخرة مطلة على الحرم..." />
            </UFormGroup>
            <UFormGroup label="Description (English)">
              <UTextarea v-model="hotelModalForm.descriptionEn" dir="ltr" :rows="2" placeholder="Luxury stay overlooking the Haram..." />
            </UFormGroup>
          </div>
        </div>

        <div class="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="isHotelModalOpen = false">إلغاء</UButton>
          <UButton color="amber" class="font-bold" @click="saveHotelModal">حفظ الفندق</UButton>
        </div>
      </div>
    </UModal>

    <!-- 2. HOTEL PREVIEW MODAL (FULL BILINGUAL PREVIEW & LINKED PRICES) -->
    <UModal v-model="isPreviewHotelModalOpen" :ui="{ width: 'sm:max-w-2xl' }">
      <div v-if="previewHotelData" class="p-6 space-y-5 bg-white dark:bg-stone-900 rounded-2xl">
        <div class="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <div class="flex items-center gap-2">
            <UIcon name="i-mdi-office-building" class="w-6 h-6 text-amber-500" />
            <h3 class="text-lg font-bold text-stone-900 dark:text-stone-100">
              معاينة بيانات الفندق الشاملة
            </h3>
          </div>
          <UButton size="xs" color="gray" variant="ghost" icon="i-mdi-close" @click="isPreviewHotelModalOpen = false" />
        </div>

        <!-- Hotel Banner Preview -->
        <div class="relative h-44 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
          <img
            v-if="previewHotelData.image"
            :src="previewHotelData.image"
            :alt="previewHotelData.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-amber-500">
            <UIcon name="i-mdi-office-building" class="w-12 h-12" />
          </div>
          <div class="absolute bottom-3 right-3 left-3 flex items-center justify-between gap-2 flex-wrap">
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-stone-950/80 text-white backdrop-blur-sm">
              📍 {{ previewHotelData.city }} / {{ previewHotelData.cityEn || previewHotelData.city }}
            </span>
            <div class="flex items-center gap-2">
              <a
                v-if="previewHotelData.googleMapsUrl"
                :href="previewHotelData.googleMapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 transition-colors shadow"
              >
                <UIcon name="i-mdi-google-maps" class="w-3.5 h-3.5" />
                <span>عرض على خرائط Google</span>
                <UIcon name="i-mdi-open-in-new" class="w-3 h-3 opacity-75" />
              </a>
              <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-600 text-white shadow">
                تصريح: {{ previewHotelData.permitNumber }}
              </span>
            </div>
          </div>
        </div>

        <!-- Bilingual Details Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Arabic Column -->
          <div class="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2 text-right">
            <span class="text-[11px] font-bold text-amber-600 dark:text-amber-400 block pb-1 border-b border-amber-500/20">
              🇸🇦 البيانات باللغة العربية
            </span>
            <div>
              <span class="text-xs text-stone-400 block font-medium">اسم الفندق:</span>
              <h4 class="font-bold text-sm text-stone-900 dark:text-stone-100">{{ previewHotelData.name }}</h4>
            </div>
            <div>
              <span class="text-xs text-stone-400 block font-medium">المدينة:</span>
              <p class="text-xs text-stone-700 dark:text-stone-300 font-semibold">{{ previewHotelData.city }}</p>
            </div>
            <div>
              <span class="text-xs text-stone-400 block font-medium">الوصف والمميزات:</span>
              <p class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">{{ previewHotelData.description || 'لا يوجد وصف مدخل' }}</p>
            </div>
          </div>

          <!-- English Column -->
          <div class="p-4 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2 text-left" dir="ltr">
            <span class="text-[11px] font-bold text-stone-500 dark:text-stone-400 block pb-1 border-b border-stone-200 dark:border-stone-700">
              🇬🇧 English Details
            </span>
            <div>
              <span class="text-xs text-stone-400 block font-medium">Hotel Name:</span>
              <h4 class="font-bold text-sm text-stone-900 dark:text-stone-100">{{ previewHotelData.nameEn || previewHotelData.name }}</h4>
            </div>
            <div>
              <span class="text-xs text-stone-400 block font-medium">City:</span>
              <p class="text-xs text-stone-700 dark:text-stone-300 font-semibold">{{ previewHotelData.cityEn || previewHotelData.city }}</p>
            </div>
            <div>
              <span class="text-xs text-stone-400 block font-medium">Description & Features:</span>
              <p class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">{{ previewHotelData.descriptionEn || previewHotelData.description || 'No description provided' }}</p>
            </div>
          </div>
        </div>

        <!-- Linked Price Packages -->
        <div class="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2">
          <div class="flex items-center justify-between">
            <h5 class="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <UIcon name="i-mdi-tag-multiple-outline" class="text-amber-500" />
              <span>الباقات السعرية المرتبطة بهذا الفندق:</span>
            </h5>
            <UBadge color="amber" variant="subtle" size="2xs">{{ getHotelLinkedPrices(previewHotelData).length }} باقة</UBadge>
          </div>

          <div v-if="getHotelLinkedPrices(previewHotelData).length > 0" class="space-y-2 max-h-40 overflow-y-auto pr-1">
            <div
              v-for="p in getHotelLinkedPrices(previewHotelData)"
              :key="p.id"
              class="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <span class="font-bold text-stone-900 dark:text-stone-100 block">{{ p.nameAr }}</span>
                <span class="text-[11px] text-stone-500 font-sans" dir="ltr">{{ p.nameEn }}</span>
              </div>
              <div class="text-left font-mono shrink-0">
                <span class="font-bold text-amber-600 dark:text-amber-400 text-sm">{{ p.priceSar }}</span>
                <span class="text-[10px] text-stone-400 block">ر.س / {{ p.unitAr || 'ليلة' }}</span>
              </div>
            </div>
          </div>
          <p v-else class="text-xs text-stone-400 italic">لا توجد باقات سعرية مضافة لهذا الفندق حتى الآن.</p>
        </div>

        <div class="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end">
          <UButton color="amber" variant="soft" class="font-bold rounded-xl" @click="isPreviewHotelModalOpen = false">إغلاق المعاينة</UButton>
        </div>
      </div>
    </UModal>

    <!-- 3. HOTEL DELETE CONFIRMATION MODAL (WARNS ABOUT RELATED PRICES) -->
    <UModal v-model="isDeleteHotelModalOpen" :ui="{ width: 'sm:max-w-md' }">
      <div v-if="hotelToDelete" class="p-6 space-y-4 bg-white dark:bg-stone-900 rounded-2xl">
        <div class="flex items-center gap-3 text-red-500">
          <div class="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center font-bold text-xl shrink-0">
            <UIcon name="i-mdi-alert" class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-base font-bold text-stone-900 dark:text-stone-100">
              تأكيد حذف الفندق وباقاته السعرية
            </h3>
            <p class="text-xs text-stone-500">تحذير أمني ونظامي</p>
          </div>
        </div>

        <div class="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-stone-700 dark:text-stone-300 space-y-2">
          <p class="font-semibold text-stone-900 dark:text-stone-100">
            هل أنت متأكد من حذف فندق <strong class="text-red-600">"{{ hotelToDelete.name }}"</strong>؟
          </p>
          <p class="text-[11px] text-red-700 dark:text-red-300 leading-relaxed">
            ⚠️ <strong>تنبيه هام:</strong> سيؤدي حذف هذا الفندق إلى حذف كافة الباقات السعرية والغرف المرتبطة به تلقائياً (عدد: <strong>{{ getHotelLinkedPrices(hotelToDelete).length }} باقة</strong>) لضمان اتساق البيانات وتفادي أي أخطاء نظامية.
          </p>
        </div>

        <div class="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="isDeleteHotelModalOpen = false">إلغاء</UButton>
          <UButton color="red" class="font-bold rounded-xl" @click="confirmDeleteHotel">
            تأكيد وحذف الكل
          </UButton>
        </div>
      </div>
    </UModal>

    <!-- 4. PRICE PACKAGE MODAL FORM (LINKED TO REGISTERED HOTELS) -->
    <UModal v-model="isPriceModalOpen" :ui="{ width: 'sm:max-w-2xl' }">
      <div class="p-6 space-y-4 bg-white dark:bg-stone-900 rounded-2xl">
        <div class="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <h3 class="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <UIcon name="i-mdi-tag-text-outline" class="text-amber-500" />
            <span>{{ editingPriceIndex !== null ? 'تعديل باقة سعرية' : 'إضافة باقة سعرية جديدة' }}</span>
          </h3>
          <UButton size="xs" color="gray" variant="ghost" icon="i-mdi-close" @click="isPriceModalOpen = false" />
        </div>

        <div class="space-y-4">
          <!-- Registered Hotel Link Selector -->
          <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <UFormGroup label="ربط الباقة بفندق مسجل في النظام" required help="يتم ربط الباقة بالفندق واستيراد رقم ترخيصه تلقائياً">
              <USelect
                v-model="priceModalForm.hotelId"
                :options="hotelDropdownOptions"
                option-attribute="label"
                value-attribute="value"
                size="md"
                class="rounded-xl"
                @change="onHotelSelectedInPriceModal"
              />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <UFormGroup label="نوع الغرفة / الخدمة" required>
              <USelect
                v-model="priceModalForm.roomType"
                :options="roomTypeModalOptions"
                option-attribute="label"
                value-attribute="value"
                size="md"
                class="rounded-xl"
              />
            </UFormGroup>
            <UFormGroup label="السعر الإجمالي بالريال السعودي (شامل 15% ضريبة)" required>
              <UInput v-model.number="priceModalForm.priceSar" type="number" size="md" dir="ltr" placeholder="500" />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <UFormGroup label="اسم الغرفة / الخدمة (عربي)" required>
              <UInput v-model="priceModalForm.nameAr" placeholder="مثال: غرفة ديلوكس مطلة على الحرم" />
            </UFormGroup>
            <UFormGroup label="Service / Room Name (English)" required>
              <UInput v-model="priceModalForm.nameEn" dir="ltr" placeholder="Deluxe Haram View Room" />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <UFormGroup label="الوحدة (عربي)">
              <UInput v-model="priceModalForm.unitAr" placeholder="لليلة الواحدة" />
            </UFormGroup>
            <UFormGroup label="Unit (English)">
              <UInput v-model="priceModalForm.unitEn" dir="ltr" placeholder="Per night" />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <UFormGroup label="الوصف والتفاصيل (عربي)">
              <UTextarea v-model="priceModalForm.descriptionAr" :rows="2" placeholder="شامل الإفطار لشخصين والخدمات..." />
            </UFormGroup>
            <UFormGroup label="Description & Details (English)">
              <UTextarea v-model="priceModalForm.descriptionEn" dir="ltr" :rows="2" placeholder="Includes breakfast for 2..." />
            </UFormGroup>
          </div>
        </div>

        <div class="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="isPriceModalOpen = false">إلغاء</UButton>
          <UButton color="amber" class="font-bold" @click="savePriceModal">حفظ الباقة السعرية</UButton>
        </div>
      </div>
    </UModal>

    <!-- 5. PRICE PACKAGE DELETE CONFIRMATION MODAL -->
    <UModal v-model="isDeletePriceModalOpen" :ui="{ width: 'sm:max-w-md' }">
      <div v-if="priceToDelete" class="p-6 space-y-4 bg-white dark:bg-stone-900 rounded-2xl">
        <div class="flex items-center gap-3 text-red-500">
          <div class="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center font-bold text-xl shrink-0">
            <UIcon name="i-mdi-tag-remove-outline" class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-base font-bold text-stone-900 dark:text-stone-100">
              تأكيد حذف الباقة السعرية
            </h3>
            <p class="text-xs text-stone-500">إجراء لا يمكن التراجع عنه بعد الحفظ</p>
          </div>
        </div>

        <div class="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-stone-700 dark:text-stone-300 space-y-2">
          <p class="font-semibold text-stone-900 dark:text-stone-100">
            هل أنت متأكد من حذف باقة <strong class="text-red-600">"{{ priceToDelete.nameAr }}"</strong>؟
          </p>
          <div class="p-2.5 rounded-lg bg-white/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-1 text-[11px]">
            <div v-if="getHotelNameForPrice(priceToDelete)" class="text-stone-600 dark:text-stone-300">
              🏨 الفندق المرتبط: <strong>{{ getHotelNameForPrice(priceToDelete) }}</strong>
            </div>
            <div class="text-stone-600 dark:text-stone-300">
              💰 السعر الإجمالي: <strong class="text-amber-600 font-mono">{{ priceToDelete.priceSar }} ر.س</strong> / {{ priceToDelete.unitAr || 'ليلة' }} (شامل الضريبة)
            </div>
            <div v-if="priceToDelete.nameEn" class="text-stone-400 font-sans" dir="ltr">
              {{ priceToDelete.nameEn }}
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="isDeletePriceModalOpen = false">إلغاء</UButton>
          <UButton color="red" class="font-bold rounded-xl" @click="confirmDeletePrice">
            تأكيد وحذف الباقة
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { useCmsContent, defaultCmsContent, type CmsSiteContent, type CmsHotelItem, type CmsPriceItem } from "~/composables/useCmsContent";

const { content, saveContent } = useCmsContent();
const toast = useToast();
const isSaving = ref(false);

const activeMainTab = ref("bookings");
const innerLangTab = ref<"ar" | "en">("ar");

const form = reactive<CmsSiteContent>(JSON.parse(JSON.stringify(defaultCmsContent)));

// Sync form with CMS data when loaded
watch(
  content,
  (newVal) => {
    if (newVal) {
      Object.assign(form, JSON.parse(JSON.stringify(newVal)));
    }
  },
  { immediate: true, deep: true }
);

const operationTabs = [
  { id: "bookings", label: "الحجوزات الإلكترونية", icon: "i-mdi-calendar-check-outline", badge: "مباشر" },
  { id: "messages", label: "الرسائل والشكاوى (24/7)", icon: "i-mdi-inbox-multiple-outline" },
];

const contentTabs = [
  { id: "legal", label: "الهوية والتراخيص الرسمية", icon: "i-mdi-shield-check-outline" },
  { id: "support", label: "خدمة العملاء والشكاوى 24/7", icon: "i-mdi-headset" },
  { id: "hero", label: "الواجهة الرئيسية والعروض", icon: "i-mdi-view-compact-outline" },
  { id: "about", label: "من نحن ونبذة المؤسسة", icon: "i-mdi-information-outline" },
  { id: "hotels", label: "سجل الفنادق المرخصة", icon: "i-mdi-office-building-cog-outline" },
  { id: "prices", label: "قائمة الأسعار الشاملة للضريبة", icon: "i-mdi-tag-text-outline" },
  { id: "policies", label: "السياسات والضمانات النظامية", icon: "i-mdi-file-document-check-outline" },
  { id: "contact", label: "معلومات التواصل والبنك", icon: "i-mdi-card-account-phone-outline" },
  { id: "socials", label: "شبكات التواصل الاجتماعي", icon: "i-mdi-share-variant-outline" },
];

const currentTabMeta = computed(() => {
  const all = [...operationTabs, ...contentTabs];
  const found = all.find((t) => t.id === activeMainTab.value);
  const bilingualTabs = ["hero", "about", "hotels", "prices", "policies", "contact"];
  return {
    label: found?.label || "لوحة التحكم",
    icon: found?.icon || "i-mdi-cog",
    desc: "تعديل النصوص والإعدادات باللغتين العربية والإنجليزية",
    hasBilingual: bilingualTabs.includes(activeMainTab.value),
  };
});

// Truncate helper for description column
const getTruncatedDesc = (text?: string, maxLen = 30) => {
  if (!text) return "-";
  const clean = text.replace(/<[^>]*>/g, "").trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen) + "...";
};

// HOTEL MODAL & ACTIONS STATE
const isHotelModalOpen = ref(false);
const editingHotelIndex = ref<number | null>(null);
const hotelModalForm = reactive<CmsHotelItem>({
  id: "",
  name: "",
  nameEn: "",
  city: "مكة المكرمة",
  cityEn: "Makkah",
  image: "/9.jpeg",
  description: "",
  descriptionEn: "",
  permitNumber: "",
  googleMapsUrl: "",
});

// HOTEL PREVIEW MODAL STATE
const isPreviewHotelModalOpen = ref(false);
const previewHotelData = ref<CmsHotelItem | null>(null);

const openPreviewHotelModal = (hotel: CmsHotelItem) => {
  previewHotelData.value = { ...hotel };
  isPreviewHotelModalOpen.value = true;
};

// HOTEL DELETE CONFIRMATION STATE
const isDeleteHotelModalOpen = ref(false);
const hotelToDeleteIndex = ref<number | null>(null);
const hotelToDelete = computed(() => {
  if (hotelToDeleteIndex.value === null || !form.hotelsServices.items) return null;
  return form.hotelsServices.items[hotelToDeleteIndex.value];
});

const promptDeleteHotel = (index: number) => {
  hotelToDeleteIndex.value = index;
  isDeleteHotelModalOpen.value = true;
};

const getHotelLinkedPrices = (hotel: CmsHotelItem | null) => {
  if (!hotel || !form.prices.items) return [];
  const hId = hotel.id;
  const hName = hotel.name;
  return form.prices.items.filter((p: any) => {
    return (hId && p.hotelId === hId) || p.hotelId === hName || p.hotelNameAr === hName;
  });
};

const confirmDeleteHotel = async () => {
  if (hotelToDeleteIndex.value === null) return;
  const targetHotel = form.hotelsServices.items[hotelToDeleteIndex.value];
  if (!targetHotel) return;

  const hId = targetHotel.id;
  const hName = targetHotel.name;

  // 1. Remove the hotel
  form.hotelsServices.items.splice(hotelToDeleteIndex.value, 1);

  // 2. Cascade delete related price items
  let deletedPricesCount = 0;
  if (form.prices.items) {
    const originalCount = form.prices.items.length;
    form.prices.items = form.prices.items.filter((p: any) => {
      const isLinked = (hId && p.hotelId === hId) || p.hotelId === hName || p.hotelNameAr === hName;
      return !isLinked;
    });
    deletedPricesCount = originalCount - form.prices.items.length;
  }

  isDeleteHotelModalOpen.value = false;
  hotelToDeleteIndex.value = null;

  // Auto save to Firestore
  try {
    isSaving.value = true;
    const res = await saveContent(form);
    if (res.success) {
      if (deletedPricesCount > 0) {
        toast.add({
          title: "تم حذف الفندق وحفظ التغييرات تلقائياً",
          description: `تم حذف الفندق و ${deletedPricesCount} باقة سعرية وحفظها في قاعدة البيانات مباشرة.`,
          color: "emerald",
          icon: "i-mdi-check-circle",
        });
      } else {
        toast.add({
          title: "تم حذف الفندق وحفظ التغييرات تلقائياً",
          color: "emerald",
          icon: "i-mdi-check-circle",
        });
      }
    } else {
      throw new Error(res.error);
    }
  } catch (err: any) {
    toast.add({
      title: "حدث خطأ أثناء الحفظ التلقائي",
      description: err?.message,
      color: "red",
      icon: "i-mdi-alert-circle",
    });
  } finally {
    isSaving.value = false;
  }
};

const openAddHotelModal = () => {
  editingHotelIndex.value = null;
  Object.assign(hotelModalForm, {
    id: `hotel-${Date.now()}`,
    name: "",
    nameEn: "",
    city: "مكة المكرمة",
    cityEn: "Makkah",
    image: "/9.jpeg",
    description: "",
    descriptionEn: "",
    permitNumber: form.legal.licenseNumber ? `${form.legal.licenseNumber}-` : "",
    googleMapsUrl: "",
  });
  isHotelModalOpen.value = true;
};

const openEditHotelModal = (index: number) => {
  editingHotelIndex.value = index;
  const h = form.hotelsServices.items[index];
  Object.assign(hotelModalForm, JSON.parse(JSON.stringify(h)));
  isHotelModalOpen.value = true;
};

const saveHotelModal = async () => {
  if (!hotelModalForm.name.trim()) {
    toast.add({ title: "يرجى كتابة اسم الفندق", color: "red" });
    return;
  }
  if (!hotelModalForm.permitNumber.trim()) {
    toast.add({ title: "يرجى كتابة رقم تصريح وزارة السياحة", color: "red" });
    return;
  }

  if (!form.hotelsServices.items) form.hotelsServices.items = [];

  const isEdit = editingHotelIndex.value !== null;

  if (isEdit) {
    const oldHotel = form.hotelsServices.items[editingHotelIndex.value!];
    form.hotelsServices.items[editingHotelIndex.value!] = { ...hotelModalForm };

    // Update parent hotel name & permit on linked prices if changed
    if (form.prices.items) {
      form.prices.items.forEach((p: any) => {
        if ((oldHotel.id && p.hotelId === oldHotel.id) || p.hotelId === oldHotel.name || p.hotelNameAr === oldHotel.name) {
          p.hotelId = hotelModalForm.id || hotelModalForm.name;
          p.hotelNameAr = hotelModalForm.name;
          p.hotelNameEn = hotelModalForm.nameEn || hotelModalForm.name;
          p.permitNumber = hotelModalForm.permitNumber;
        }
      });
    }
  } else {
    form.hotelsServices.items.push({ ...hotelModalForm });
  }

  isHotelModalOpen.value = false;

  // Auto-save to Firestore
  try {
    isSaving.value = true;
    const res = await saveContent(form);
    if (res.success) {
      toast.add({
        title: isEdit ? "تم تحديث بيانات الفندق وحفظها تلقائياً" : "تم إضافة الفندق وحفظه تلقائياً",
        description: "تم حفظ التعديلات في قاعدة البيانات مباشرة.",
        color: "emerald",
        icon: "i-mdi-check-circle",
      });
    } else {
      throw new Error(res.error);
    }
  } catch (err: any) {
    toast.add({
      title: "حدث خطأ أثناء الحفظ التلقائي",
      description: err?.message,
      color: "red",
      icon: "i-mdi-alert-circle",
    });
  } finally {
    isSaving.value = false;
  }
};

// PRICE MODAL STATE & RELATIONS
const isPriceModalOpen = ref(false);
const editingPriceIndex = ref<number | null>(null);
const priceModalForm = reactive<CmsPriceItem>({
  id: "",
  hotelId: "",
  hotelNameAr: "",
  hotelNameEn: "",
  roomType: "standard",
  nameAr: "",
  nameEn: "",
  descriptionAr: "",
  descriptionEn: "",
  priceSar: 500,
  unitAr: "لليلة الواحدة",
  unitEn: "Per night",
  includesVat: true,
  vatPercentage: 15,
  permitNumber: "",
});

const hotelDropdownOptions = computed(() => {
  const list = form.hotelsServices?.items || [];
  return list.map((h: any) => ({
    label: `${h.name} (${h.permitNumber || 'مرخص'})`,
    value: h.id || h.name,
    hotel: h,
  }));
});

const roomTypeModalOptions = [
  { label: "غرفة قياسية (Standard Room)", value: "standard" },
  { label: "غرفة ديلوكس (Deluxe Room)", value: "deluxe" },
  { label: "جناح عائلي (Family Suite)", value: "suite" },
  { label: "غرفة / جناح تنفيذي (Executive)", value: "executive" },
  { label: "باقة خدمة خاصة (Service Package)", value: "service" },
];

const onHotelSelectedInPriceModal = () => {
  const found = form.hotelsServices?.items?.find((h: any) => (h.id || h.name) === priceModalForm.hotelId);
  if (found) {
    priceModalForm.hotelNameAr = found.name;
    priceModalForm.hotelNameEn = found.nameEn || found.name;
    priceModalForm.permitNumber = found.permitNumber;
  }
};

const openAddPriceModal = () => {
  editingPriceIndex.value = null;
  const firstHotel = form.hotelsServices?.items?.[0];
  Object.assign(priceModalForm, {
    id: `item-${Date.now()}`,
    hotelId: firstHotel ? (firstHotel.id || firstHotel.name) : "",
    hotelNameAr: firstHotel ? firstHotel.name : "",
    hotelNameEn: firstHotel ? (firstHotel.nameEn || firstHotel.name) : "",
    roomType: "standard",
    nameAr: "",
    nameEn: "",
    descriptionAr: "شامل ضريبة القيمة المضافة 15% وكافة الرسوم النظامية",
    descriptionEn: "Inclusive of 15% VAT and statutory fees",
    priceSar: 500,
    unitAr: "لليلة الواحدة",
    unitEn: "Per night",
    includesVat: true,
    vatPercentage: 15,
    permitNumber: firstHotel ? firstHotel.permitNumber : form.legal.licenseNumber,
  });
  isPriceModalOpen.value = true;
};

const openEditPriceModal = (index: number) => {
  editingPriceIndex.value = index;
  const p = form.prices.items[index];
  Object.assign(priceModalForm, JSON.parse(JSON.stringify(p)));
  isPriceModalOpen.value = true;
};

const savePriceModal = async () => {
  if (!priceModalForm.nameAr.trim()) {
    toast.add({ title: "يرجى كتابة اسم الغرفة / الخدمة بالعربية", color: "red" });
    return;
  }
  if (!priceModalForm.priceSar || priceModalForm.priceSar <= 0) {
    toast.add({ title: "يرجى تحديد السعر الإجمالي بالريال السعودي", color: "red" });
    return;
  }

  // Ensure hotel relation
  onHotelSelectedInPriceModal();

  if (!form.prices.items) form.prices.items = [];

  const isEdit = editingPriceIndex.value !== null;

  if (isEdit) {
    form.prices.items[editingPriceIndex.value!] = { ...priceModalForm };
  } else {
    form.prices.items.push({ ...priceModalForm });
  }

  isPriceModalOpen.value = false;

  // Auto-save to Firestore
  try {
    isSaving.value = true;
    const res = await saveContent(form);
    if (res.success) {
      toast.add({
        title: isEdit ? "تم تحديث الباقة السعرية وحفظها تلقائياً" : "تمت إضافة الباقة السعرية وحفظها تلقائياً",
        description: "تم حفظ التعديلات في قاعدة البيانات مباشرة.",
        color: "emerald",
        icon: "i-mdi-check-circle",
      });
    } else {
      throw new Error(res.error);
    }
  } catch (err: any) {
    toast.add({
      title: "حدث خطأ أثناء الحفظ التلقائي",
      description: err?.message,
      color: "red",
      icon: "i-mdi-alert-circle",
    });
  } finally {
    isSaving.value = false;
  }
};

// PRICE DELETE CONFIRMATION MODAL STATE
const isDeletePriceModalOpen = ref(false);
const priceToDeleteIndex = ref<number | null>(null);
const priceToDelete = computed(() => {
  if (priceToDeleteIndex.value === null || !form.prices.items) return null;
  return form.prices.items[priceToDeleteIndex.value];
});

const promptDeletePrice = (index: number) => {
  priceToDeleteIndex.value = index;
  isDeletePriceModalOpen.value = true;
};

const confirmDeletePrice = async () => {
  if (priceToDeleteIndex.value === null || !form.prices.items) return;
  const deletedItem = form.prices.items[priceToDeleteIndex.value];
  form.prices.items.splice(priceToDeleteIndex.value, 1);
  isDeletePriceModalOpen.value = false;
  priceToDeleteIndex.value = null;

  // Auto-save to Firestore
  try {
    isSaving.value = true;
    const res = await saveContent(form);
    if (res.success) {
      toast.add({
        title: "تم حذف الباقة السعرية وحفظ التغيير تلقائياً",
        description: deletedItem?.nameAr ? `تم حذف "${deletedItem.nameAr}" من قاعدة البيانات مباشرة.` : undefined,
        color: "emerald",
        icon: "i-mdi-check-circle",
      });
    } else {
      throw new Error(res.error);
    }
  } catch (err: any) {
    toast.add({
      title: "حدث خطأ أثناء الحفظ التلقائي",
      description: err?.message,
      color: "red",
      icon: "i-mdi-alert-circle",
    });
  } finally {
    isSaving.value = false;
  }
};

const getHotelNameForPrice = (item: CmsPriceItem) => {
  if (item.hotelNameAr) return item.hotelNameAr;
  if (item.hotelId) {
    const parent = form.hotelsServices?.items?.find((h: any) => (h.id || h.name) === item.hotelId);
    if (parent) return parent.name;
  }
  return "";
};

const getPermitForPrice = (item: CmsPriceItem) => {
  if (item.permitNumber) return item.permitNumber;
  if (item.hotelId) {
    const parent = form.hotelsServices?.items?.find((h: any) => (h.id || h.name) === item.hotelId);
    if (parent && parent.permitNumber) return parent.permitNumber;
  }
  return form.legal.licenseNumber || "-";
};

const handleSave = async () => {
  try {
    isSaving.value = true;
    const res = await saveContent(form);
    if (res.success) {
      toast.add({
        title: "تم حفظ التعديلات بنجاح",
        description: "تم تحديث محتوى الموقع باللغتين بنجاح.",
        color: "emerald",
        icon: "i-mdi-check-circle",
      });
    } else {
      throw new Error(res.error);
    }
  } catch (err: any) {
    toast.add({
      title: "فشل الحفظ",
      description: err?.message || "حدث خطأ أثناء الحفظ",
      color: "red",
      icon: "i-mdi-alert-circle",
    });
  } finally {
    isSaving.value = false;
  }
};
</script>
