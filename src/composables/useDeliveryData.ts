import { ref } from 'vue'

export function useDeliveryData() {
    const data = ref<any>(null)
    const error = ref<string | null>(null)
    const loading = ref(false)
    const fetchDeliveryInfo = async (id: number) => {
        loading.value = true
        error.value = null
        data.value = null
        try {
          const res = await fetch(`https://testologia.ru/delivery/info?id=${id}`)
          const delivery = await res.json();

          if (delivery.error) {
            error.value = delivery.error
          } else {
            data.value = delivery
          }
        } catch (e: any) {
            error.value = 'Ошибка при соединении с сервером'
        } finally {
            loading.value = false
        }
    }

    return { data, error, loading, fetchDeliveryInfo }
}