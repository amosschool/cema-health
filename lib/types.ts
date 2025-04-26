export interface Client {
  id: string
  fullName: string
  gender: "male" | "female" | "other"
  age: number // This remains a number in the data model
  contactInfo: string
  enrolledPrograms: string[]
  createdAt: string
}

export interface Program {
  id: string
  name: string
  description: string
  createdAt: string
}
