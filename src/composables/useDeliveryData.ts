import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useTrackDelivery() {
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

export function useCreateDelivery() {
  const { t } = useI18n()
  const result = ref<any>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  const createOrderDelivery = async (payload: any) => {
    loading.value = true
    error.value = null
    result.value = null

    try {
      const res = await fetch('https://testologia.ru/delivery/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
      const response = await res.json()
      if (!res.ok || response.error) {
        error.value = response.error || t('order.errors.server_fail')
      } else {
        result.value = response
        return response
      }

    } catch (e: any) {
      error.value = 'Ошибка при соединении с сервером'
    } finally {
      loading.value = false
    }
  }

  return { result, loading, error, createOrderDelivery }
}