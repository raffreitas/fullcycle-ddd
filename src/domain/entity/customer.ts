import { Address } from './value-objects/address'

export class Customer {
  private _id: string
  private _name = ''
  private _address!: Address
  private _active = false
  private _rewardPoints = 0

  constructor(id: string, name: string) {
    this._id = id
    this._name = name
    this.validate()
  }

  public get id() {
    return this._id
  }

  public get name() {
    return this._name
  }

  get rewardPoints(): number {
    return this._rewardPoints
  }

  get address() {
    return this._address
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error('ID is required')
    }
    if (this._name.length === 0) {
      throw new Error('Name is required')
    }
  }

  changeName(name: string) {
    this._name = name
    this.validate()
  }

  changeAddress(address: Address) {
    this._address = address
  }

  isActive(): boolean {
    return this._active
  }

  activate() {
    if (this._address === undefined) {
      throw new Error('Address is mandatory to activate a customer')
    }
    this._active = true
  }

  deactivate() {
    this._active = false
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points
  }
}
