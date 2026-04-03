import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrderStore = defineStore('order', () => {
  const lastOrderId = ref<number | null>(null)
  const lastCalculation = ref<any>(null)

  function saveOrder(id: number, calc: any) {
    lastOrderId.value = id
    lastCalculation.value = calc
  }

  function clear() {
    lastOrderId.value = null
    lastCalculation.value = null
  }

  return { lastOrderId, lastCalculation, saveOrder, clear }
})