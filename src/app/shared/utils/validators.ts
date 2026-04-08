export function isValidDni(dni: string) {
  return /^\d{8}$/.test(dni)
}

export function isValidRuc(ruc: string) {
  return /^\d{11}$/.test(ruc)
}
