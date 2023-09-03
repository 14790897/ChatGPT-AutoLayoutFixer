<template>
  <div id="app" class="p-4 bg-gray-100 ">
    <h1 class="flex justify-center items-center text-xl font-bold mb-4">Custom Page Scroll</h1>
    <div class="flex justify-center items-center text-xl font-bold mb-4">
      <span v-for="(char, index) in colorfulText" :key="index" :class="char.class">
        {{ char.text }}
      </span>
    </div>
    <div class="space-y-4">
      <label class="flex items-center space-x-4">
        <span class="text-base">Page Up Distance:</span>
        <input v-model="pageUpDistance" class="p-2 border rounded w-full" />
      </label>
      <label class="flex items-center space-x-4">
        <span class="text-base">Page Down Distance:</span>
        <input v-model="pageDownDistance" class="p-2 border rounded w-full" />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
const greeting = ref('');
const pageUpDistance = ref<number>(0);
const pageDownDistance = ref<number>(0);
let intervalId: any;
const colors = ['text-red-500', 'text-green-500', 'text-blue-500', 'text-yellow-500', 'text-purple-500'];
let currentColorIndex = ref(0);

onMounted(() => {
  chrome.storage.sync.get(['pageUpDistance', 'pageDownDistance'], (result: any) => {
    pageUpDistance.value = result.pageUpDistance || 300;
    pageDownDistance.value = result.pageDownDistance || 300;
  });

  //Show the greeting world 8.31
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    greeting.value = '早上好！';
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting.value = '中午好！';
  } else {
    greeting.value = '晚上好！';
  }

  intervalId = setInterval(() => {
    currentColorIndex.value = (currentColorIndex.value + 1) % colors.length;
    // console.log('currentColorIndex', currentColorIndex)
  }, 500); // 每500毫秒更新一次
});

onUnmounted(() => {
  clearInterval(intervalId);
});

const colorfulText = computed(() => {
  console.log('currentColorIndex', currentColorIndex.value)
  return Array.from(greeting.value).map((char, index) => {
    return {
      text: char,
      class: colors[(currentColorIndex.value + index) % colors.length]
    };
  });
});

const updateScrollDistance = (key: string, value: number) => {
  chrome.storage.sync.set({ [key]: value });
};

watch(pageUpDistance, (newVal: number) => {
  updateScrollDistance('pageUpDistance', newVal);
});

watch(pageDownDistance, (newVal: number) => {
  updateScrollDistance('pageDownDistance', newVal);
});

</script>