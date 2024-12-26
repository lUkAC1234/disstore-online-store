class IService<CTX> {
  private _ctx: CTX;

  get ctx(): CTX {
    return this._ctx;
  }

  constructor(ctx: CTX) {
    this._ctx = ctx;
  }
}

export default IService;
