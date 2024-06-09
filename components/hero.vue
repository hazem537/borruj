<template>
  <div
    class="image-container flex opacity-100 justify-center items-center text-black bg-white">
    <img
      v-for="(img, index) in images"
      :key="index"
      :src="img"
      :class="{ active: index === activeIndex }"
      alt="" />
    <div
      class="z-10 text-2xl flex flex-col items-center justify-center gap-10 w-3/4 h-full">
      <p>
        اهلا بك في
        <span class="text-7xl text-amber-500"> بروج </span>
      </p>
      <p>طريقك إلى مكة والمدينة بكل سهولة</p>
      <div class="bg-red rounded-xl bg-amber-400 px-4 py-2 flex flex-col gap-5" v-if="ads?.show">
        <p class="text-xl text-black" > 
         {{ ads.data }}
          <!-- Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora fuga -->
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

const images = [
  "/9.jpeg",
  "/10.jpeg",
  "/11.jpeg",
  "/13.jpeg",
  "/14.jpeg",
  "/15.jpeg",
  "/16.jpeg",
  "/17.jpeg",
  "/18.jpeg",
  "/19.jpeg",
  "/test/1.jpeg",
  "/test/2.jpeg",
  "/test/3.jpeg",
  "/test/4.jpeg",
  "/test/5.jpeg",
  "/test/6.jpeg",
  "/test/7.jpeg",
  "/test/8.jpeg",
  "/test/20.jpeg",


  // "https://www.emaaraldiyafa.com/Content/img/2.jpg",
  // "https://www.emaaraldiyafa.com/Content/img/4.jpg",
  // "https://www.emaaraldiyafa.com/Content/img/6.jpg",
  // "https://www.emaaraldiyafa.com/Content/img/5.jpg",
];

const activeIndex = ref(0);

const startAnimation = () => {
  setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % images.length;
  }, 3000); // Change image every 2 seconds
};

onMounted(() => {
  startAnimation();
});

import { collection, doc,  } from "firebase/firestore";
const db = useFirestore();

const ads = useDocument(doc(collection(db, 'assets'), 'lEJtgJXfx9SGM0COpYJB'))
</script>

<style scoped>
.image-container {
  position: relative;
  overflow: hidden;
}

.image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: all 3s;
}
.image-container p {
  opacity: 100;
}

.image-container img.active {
  opacity: 1;
  animation: zoomIn 4s forwards;
}

@keyframes zoomIn {
  0% {
    transform: scale(1);
    opacity: 0.75;
  }
  100% {
    transform: scale(1.25);
    opacity: 0.9;
  }
}
</style>
