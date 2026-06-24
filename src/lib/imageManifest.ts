/**
 * Manifiesto de verificación visual de imágenes (firma del "departamento de
 * calidad"). Cada vez que se cambia una foto de producto hay que revisarla a
 * ojo y actualizar esta tabla: `verified` y si la foto MUESTRA un cable.
 *
 * La suite de calidad (quality.test.ts) usa esto para impedir incoherencias
 * como un ratón CON CABLE en un producto INALÁMBRICO.
 */
export interface ImageCheck {
  verified: boolean;
  muestraCable: boolean;
}

export const IMAGE_MANIFEST: Record<string, ImageCheck> = {
  "viper-v3-pro": { verified: true, muestraCable: false },
  "deathadder-essential": { verified: true, muestraCable: true },
  "mx-master-4": { verified: true, muestraCable: false },
  "pebble-2": { verified: true, muestraCable: false },
  "g-pro-x-superlight": { verified: true, muestraCable: false },
  "ergo-m575": { verified: true, muestraCable: false },
  "vertical-lift": { verified: true, muestraCable: false },
  "aerox-3-wireless": { verified: true, muestraCable: false },
};
