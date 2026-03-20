export type StepType =
  | 'text-input'
  | 'text-autocomplete'
  | 'dropdown'
  | 'card-selector'
  | 'chips'
  | 'chips-multi'
  | 'chips-conditional'
  | 'section-header'

export interface CardOption {
  label: string
  image?: string
}

export interface FormStep {
  id: string
  type: StepType
  heading: string
  subheading?: string
  placeholder?: string
  options?: string[]
  cardOptions?: CardOption[]
  hasCheckbox?: boolean
  checkboxLabel?: string
  dbField: string
  conditionalField?: string
  inputType?: string
  prefix?: string
  required?: boolean
  icon?: string
  optionsByCity?: Record<string, string[]>
  exclusiveOption?: string
  numberFormat?: 'currency'
}

const ICON_BUILDING = '/assets/form-icons-combined/icon-form-building.svg'
const ICON_ADDRESS = '/assets/form-icons-combined/icon-form-address.svg'
const ICON_USER = '/assets/form-icons-combined/icon-form-user.svg'
const ICON_USER_02 = '/assets/form-icons-combined/icon-form-user-02.svg'
const ICON_MAIL = '/assets/form-icons-combined/icon-form-mail.svg'
const ICON_PHONE = '/assets/form-icons-combined/icon-form-phone.svg'
const ICON_CALENDAR = '/assets/form-icons-combined/icon-form-calendar.svg'
const ICON_BEDS = '/assets/form-icons-combined/icon-form-beds.svg'
const ICON_BATHROOM = '/assets/form-icons-combined/icon-form-bathroom.svg'
const ICON_CAR = '/assets/form-icons-combined/icon-form-car.svg'
const ICON_MONEY = '/assets/form-icons-combined/icon-form-money.svg'

const BUILDING_TREE = '/assets/form-assets/47f3342fd9ff6cbc85a51b283be21a0172bfca8a.svg'
const BUILDINGS = '/assets/form-assets/43d6a94532f13c546b72bbd92898ce26a584e6db.svg'
const HOUSE_SINGLE = '/assets/form-assets/3edfc262a0ec6da7cb7114727d96d9d60956c6c3.svg'
const HOUSE_CLUSTER = '/assets/form-assets/13fdc54ea53e95edf65359d99d1afba0178e2302.svg'

const PARKING_INDIVIDUAL = '/assets/form-cards/parking-individual.png'
const PARKING_DOBLE = '/assets/form-cards/parking-doble.png'

export const BARRIOS_POR_CIUDAD: Record<string, string[]> = {
  'Bogotá': [
    'Usaquén', 'Chapinero', 'Santa Fe', 'San Cristóbal', 'Usme',
    'Tunjuelito', 'Bosa', 'Kennedy', 'Fontibón', 'Engativá',
    'Suba', 'Barrios Unidos', 'Teusaquillo', 'Los Mártires',
    'Antonio Nariño', 'Puente Aranda', 'La Candelaria',
    'Rafael Uribe Uribe', 'Ciudad Bolívar', 'Sumapaz',
  ],
  'Medellín': [
    'Popular', 'Santa Cruz', 'Manrique', 'Aranjuez', 'Castilla',
    'Doce de Octubre', 'Robledo', 'Villa Hermosa', 'Buenos Aires',
    'La Candelaria', 'Laureles - Estadio', 'La América', 'San Javier',
    'El Poblado', 'Guayabal', 'Belén',
    'San Sebastián de Palmitas', 'San Cristóbal', 'Altavista',
    'San Antonio de Prado', 'Santa Elena',
  ],
  'Cali': [
    'Comuna 1', 'Comuna 2', 'Comuna 3', 'Comuna 4', 'Comuna 5',
    'Comuna 6', 'Comuna 7', 'Comuna 8', 'Comuna 9', 'Comuna 10',
    'Comuna 11', 'Comuna 12', 'Comuna 13', 'Comuna 14', 'Comuna 15',
    'Comuna 16', 'Comuna 17', 'Comuna 18', 'Comuna 19', 'Comuna 20',
    'Comuna 21', 'Comuna 22',
  ],
  'Barranquilla': [
    'Riomar', 'Norte - Centro Histórico', 'Sur Occidente',
    'Sur Oriente', 'Metropolitana',
  ],
  'Cartagena': [
    'Histórica y del Caribe Norte', 'De la Virgen y Turística',
    'Industrial y de la Bahía',
  ],
  'Bucaramanga': [
    'Norte', 'Nororiental', 'San Francisco', 'Occidental',
    'García Rovira', 'Sur', 'Sur Occidente',
  ],
}

export const FORM_STEPS: FormStep[] = [
  {
    id: 'ciudad',
    type: 'dropdown',
    heading: '¿En qué ciudad se encuentra el inmueble?',
    placeholder: 'Selecciona la ciudad',
    options: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira', 'Manizales', 'Ibagué', 'Villavicencio', 'Santa Marta', 'Cúcuta', 'Otra'],
    hasCheckbox: true,
    checkboxLabel: 'Acepto los términos y condiciones y la política de tratamientos de datos',
    dbField: 'ciudad',
    required: true,
    icon: ICON_BUILDING,
  },
  {
    id: 'barrio',
    type: 'text-autocomplete',
    heading: '¿Cuál es el barrio o localidad?',
    placeholder: 'Escribe el barrio o localidad',
    dbField: 'barrio',
    required: true,
    icon: ICON_ADDRESS,
    optionsByCity: BARRIOS_POR_CIUDAD,
  },
  {
    id: 'direccion',
    type: 'text-input',
    heading: '¿Cuál es la dirección?',
    placeholder: 'Ejm: Calle 57b Sur #40-34',
    dbField: 'direccion',
    required: true,
    icon: ICON_ADDRESS,
  },
  {
    id: 'tipo_inmueble',
    type: 'card-selector',
    heading: '¿Qué tipo de inmueble es?',
    cardOptions: [
      { label: 'Apartamento en edificio único', image: BUILDING_TREE },
      { label: 'Apartamento en conjunto de edificios', image: BUILDINGS },
      { label: 'Casa sola', image: HOUSE_SINGLE },
      { label: 'Casa en conjunto residencial', image: HOUSE_CLUSTER },
    ],
    dbField: 'tipo_inmueble',
    required: true,
    icon: ICON_BUILDING,
  },
  {
    id: 'torre',
    type: 'text-input',
    heading: '¿En qué torre se encuentra el inmueble?',
    placeholder: 'Seleccione',
    dbField: 'torre',
    icon: ICON_BUILDING,
  },
  {
    id: 'piso',
    type: 'text-input',
    heading: '¿En qué piso?',
    placeholder: 'Seleccione',
    dbField: 'piso',
    icon: ICON_BUILDING,
  },
  {
    id: 'numero_vivienda',
    type: 'text-input',
    heading: '¿Cuál es el número de la vivienda?',
    placeholder: 'Seleccione',
    dbField: 'numero_vivienda',
    icon: ICON_BUILDING,
  },
  {
    id: 'tiene_ascensor',
    type: 'chips',
    heading: '¿El inmueble cuenta con ascensor?',
    options: ['Sí', 'No'],
    dbField: 'tiene_ascensor',
    icon: ICON_BUILDING,
  },
  {
    id: 'ultimo_piso',
    type: 'chips',
    heading: '¿Está en el último piso?',
    options: ['Sí', 'No'],
    dbField: 'ultimo_piso',
    icon: ICON_BUILDING,
  },
  {
    id: 'relacion_inmueble',
    type: 'chips',
    heading: '¿Qué relación tienes con el inmueble?',
    options: ['Soy el propietario', 'Conozco al propietario', 'Soy agente inmobiliario'],
    dbField: 'relacion_inmueble',
    required: true,
    icon: ICON_USER,
  },
  {
    id: 'nombre_contacto',
    type: 'text-input',
    heading: '¿A nombre de quién enviamos la oferta?',
    placeholder: 'Nombre completo',
    dbField: 'nombre_contacto',
    required: true,
    icon: ICON_USER_02,
  },
  {
    id: 'email_contacto',
    type: 'text-input',
    heading: '¿A cuál correo enviamos la oferta?',
    placeholder: 'Ejm: correo@mail.com',
    dbField: 'email_contacto',
    inputType: 'email',
    required: true,
    icon: ICON_MAIL,
  },
  {
    id: 'telefono_contacto',
    type: 'text-input',
    heading: '¿A qué teléfono te llamamos?',
    placeholder: 'Número de teléfono',
    dbField: 'telefono_contacto',
    inputType: 'tel',
    required: true,
    icon: ICON_PHONE,
  },
  {
    id: 'section_datos',
    type: 'section-header',
    heading: 'Estos datos son los más importantes',
    dbField: '',
  },
  {
    id: 'antiguedad',
    type: 'dropdown',
    heading: '¿Cuántos años de antigüedad tiene la vivienda?',
    placeholder: 'Seleccione',
    options: ['Menos de 1 año', '1 a 5 años', '5 a 10 años', '10 a 20 años', '20 a 30 años', 'Más de 30 años'],
    dbField: 'antiguedad',
    required: true,
    icon: ICON_CALENDAR,
  },
  {
    id: 'area_m2',
    type: 'text-input',
    heading: '¿Cuál es el área en mt2 de la vivienda?',
    placeholder: 'Ejm: 54',
    dbField: 'area_m2',
    inputType: 'number',
    required: true,
    icon: ICON_BUILDING,
  },
  {
    id: 'habitaciones',
    type: 'chips',
    heading: '¿Cuántas habitaciones tiene la propiedad?',
    subheading: 'Sin contar la habitación de servicio',
    options: ['1', '2', '3', '4', '5+'],
    dbField: 'habitaciones',
    required: true,
    icon: ICON_BEDS,
  },
  {
    id: 'banos_completos',
    type: 'chips',
    heading: '¿Cuántas baños completos tiene la vivienda?',
    subheading: 'Que cuentan con sanitario, lavamanos ducha y o tina.',
    options: ['1', '2', '3', '4', '5+'],
    dbField: 'banos_completos',
    required: true,
    icon: ICON_BATHROOM,
  },
  {
    id: 'banos_medios',
    type: 'chips',
    heading: '¿Cuántos baños medios tiene?',
    subheading: 'Que cuentan únicamente con sanitario y lavamanos.',
    options: ['1', '2', '3', '4', '5+'],
    dbField: 'banos_medios',
    icon: ICON_BUILDING,
  },
  {
    id: 'zonas',
    type: 'chips-multi',
    heading: 'Selecciona si el inmueble cuenta con alguna de estas zonas.',
    options: ['Balcón', 'Terraza', 'Parqueadero', 'No tengo ninguno'],
    dbField: 'zonas',
    icon: ICON_BUILDING,
    exclusiveOption: 'No tengo ninguno',
  },
  {
    id: 'parqueaderos',
    type: 'chips',
    heading: '¿Cuántos parqueaderos tiene?',
    subheading: 'Solo los que aparecen en la escritura',
    options: ['1', '2', '3', '4', '5+'],
    dbField: 'parqueaderos',
    icon: ICON_CAR,
  },
  {
    id: 'tipo_parqueadero',
    type: 'chips',
    heading: '¿Qué tipo de parqueadero es?',
    options: ['De uso Privado', 'Comunal'],
    dbField: 'tipo_parqueadero',
    icon: ICON_CAR,
  },
  {
    id: 'organizacion_parqueadero',
    type: 'card-selector',
    heading: '¿Cómo se organizan tu parqueadero?',
    cardOptions: [
      { label: 'Puesto individual', image: PARKING_INDIVIDUAL },
      { label: 'Puesto doble', image: PARKING_DOBLE },
    ],
    dbField: 'organizacion_parqueadero',
    icon: ICON_CAR,
  },
  {
    id: 'precio_venta',
    type: 'text-input',
    heading: '¿Cuánto estás pidiendo por tu vivienda?',
    subheading: 'Este valor no afecta tu oferta. Lo usamos para tener una referencia con inmuebles similares.',
    placeholder: '0',
    dbField: 'precio_venta',
    inputType: 'text',
    prefix: '$',
    numberFormat: 'currency',
    required: true,
    icon: ICON_MONEY,
  },
  {
    id: 'valor_administracion',
    type: 'text-input',
    heading: '¿Cuál es el valor de la administración?',
    placeholder: '0',
    dbField: 'valor_administracion',
    inputType: 'text',
    prefix: '$',
    numberFormat: 'currency',
    icon: ICON_MONEY,
  },
  {
    id: 'obra_gris',
    type: 'chips',
    heading: '¿La vivienda tiene alguna parte en obra gris?',
    options: ['Sí', 'No'],
    dbField: 'obra_gris',
    icon: ICON_BUILDING,
  },
  {
    id: 'estrato',
    type: 'dropdown',
    heading: '¿A qué estrato pertenece la vivienda?',
    placeholder: 'Seleccione',
    options: ['1', '2', '3', '4', '5', '6'],
    dbField: 'estrato',
    required: true,
    icon: ICON_BUILDING,
  },
  {
    id: 'gravamen',
    type: 'chips-conditional',
    heading: '¿La vivienda tiene algún tipo de gravamen?',
    options: ['Sí', 'No'],
    dbField: 'gravamen',
    conditionalField: 'tipo_gravamen',
    icon: ICON_BUILDING,
  },
  {
    id: 'estado_vivienda',
    type: 'chips',
    heading: '¿Cuál es el estado actual de la vivienda?',
    options: ['Está desocupada', 'Está arrendada', 'Yo la estoy habitando'],
    dbField: 'estado_vivienda',
    icon: ICON_BUILDING,
  },
  {
    id: 'zonas_comunes',
    type: 'chips-multi',
    heading: '¿El conjunto o edificio cuenta con alguna de estas zonas comunes?',
    options: [
      'Estudio', 'Depósito', 'Portería', 'Salón comunal',
      'Planta eléctrica', 'Zona de lavandería', 'Zona BBQ', 'Zona para niños',
      'Zonas verdes', 'Zonas húmedas', 'Parqueadero motos', 'Parqueadero cubierto',
      'Parqueadero visitantes',
    ],
    dbField: 'zonas_comunes',
    icon: ICON_BUILDING,
  },
  {
    id: 'motivo_venta',
    type: 'dropdown',
    heading: '¿Cuál es el motivo de venta de la vivienda?',
    placeholder: 'Seleccione',
    options: ['Cambio de vivienda', 'Necesito liquidez', 'Inversión', 'Herencia', 'Divorcio', 'Otro'],
    dbField: 'motivo_venta',
    icon: ICON_BUILDING,
  },
  {
    id: 'tiempo_vendiendo',
    type: 'dropdown',
    heading: '¿Cuánto tiempo lleva vendiendo la casa?',
    placeholder: 'Seleccione',
    options: ['Aún no la he publicado', 'Menos de 1 mes', '1 a 3 meses', '3 a 6 meses', '6 a 12 meses', 'Más de 1 año'],
    dbField: 'tiempo_vendiendo',
    icon: ICON_BUILDING,
  },
]

export const TOTAL_STEPS = FORM_STEPS.filter(s => s.type !== 'section-header').length
