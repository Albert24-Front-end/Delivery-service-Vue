import { useI18n } from 'vue-i18n'

const { t } = useI18n()

export default function getOrderData() {
  const DELIVERY_SIZES = [
    {
      value: 'xs',
      rate: 9,
      min: 149,
      description: () => t('sizes.xs'),
    },
    {
      value: 's',
      rate: 13,
      min: 199,
      description: () => t('sizes.s'),
    },
    {
      value: 'm',
      rate: 20,
      min: 249,
      description: () => t('sizes.m'),
    },
    {
      value: 'l',
      rate: 27,
      min: 349,
      description: () => t('sizes.l'),
    },
    {
      value: 'xl',
      rate: 35,
      min: 499,
      description: () => t('sizes.xl'),
    },
    {
      value: 'max',
      rate: 70,
      min: 999,
      description: () => t('sizes.max'),
      mediaClass: 'main-size-media-palleta',
    },
  ] as const

  const DELIVERY_SPEEDS = [
    { value: 'regular', label: () => t('speeds.regular') },
    { value: 'fast', label: () => t('speeds.fast') },
  ] as const

  return { DELIVERY_SIZES, DELIVERY_SPEEDS }
}
