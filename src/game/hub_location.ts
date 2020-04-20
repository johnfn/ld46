import { Entity } from "../library/entity";

export class HubLocation extends Entity {
  public static Instance: HubLocation;
  constructor() {
    super({
      name: "HubLocation",
    });

    HubLocation.Instance = this;
  }
}