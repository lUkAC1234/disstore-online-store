# Services

Services are just reusable, tiny classes containing some logic for service. To use services, we need inject them to the react component class using one of two ways:

  - Decorator function
  - Mixin function

Each way has the same capability and have the same outcome, but has the different approach for injecting services to your react component class.

## Decorator function

If you prefer using decorator function for injecting service classes, here is the basic overview of usage:

```tsx
interface Header extends LangService, DOMService, AbortControllerService {}

@Inject({
  services: [LangService, DOMService, AbortControllerService]
})
class Header extends PureComponent<YourPropType, YourStateType> {
  render(): ReactNode {
    return (
      <div>
        <h1>Header component title</h1>
      </div>
    );
  }
}
```

By doing so, you get your component working physically and type safely with proper intellisense.

## Mixin function

If you prefer using mixin functions, here is what you can do:

```tsx
interface Header extends LangService, DOMService, AbortControllerService {}

class Header extends ReactInjectable<YourPropType, YourStateType>([
  LangService,
  DOMService,
  AbortControllerService
]) {
  render(): ReactNode {
    return (
      <div>
        <h1>Header component title</h1>
      </div>
    );
  }
}
```

It results the same thing as the previous approach using decorator function.

Well, additionally for infering types in component interface, sometimes you need to infer react props or state, you need to pass props type as generic type to your service interface, because intellisense probably will conflict.

Here the example, I need props type with WithTranslation of i18n interface, here is what I can do:

```tsx
class LangService<P extends WithTranslation> {
  readonly props: Readonly<P>;

  get lang(): string {
    return this.props.i18n.language;
  }

  t(key: string | TemplateStringsArray | (string | TemplateStringsArray)[]): string {
    return this.props.t(key);
  }

  changeLanguage(lng: string, callback?: () => void): void {
    this.props.i18n.changeLanguage(lng, callback);
  }
}
```

So, I passing props to props variable in class to manage conflicts while extending interface of LangService in my component class:

```tsx
  interface Header extends LangService<YourPropType>, DOMService, AbortControllerService {}

  class Header extends ReactInjectable<YourPropType, YourStateType>([
    LangService,
    DOMService,
    AbortControllerService
  ]) {
    render(): ReactNode {
      return (
        <div>
          <h1>Header component title</h1>
        </div>
      );
    }
  }
```

By doing so, you avoid clashes in type inference, and have proper type-safety.