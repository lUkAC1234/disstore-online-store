export const setDocumentTitle = (options: SetDocumentTitleOptions): void => {
  const { path, splittedIndex, currentLng, title_ru, title_uz, title_oz } = options;

  if (path && splittedIndex) {
    if (location.pathname.split("/")[splittedIndex] === path) {
      switch (currentLng) {
        case "ru": document.title = title_ru; break;
        case "uz": document.title = title_uz; break;
        case "oz": document.title = title_oz; break;
      }
    }
  } else {
    switch (currentLng) {
      case "ru": document.title = title_ru; break;
      case "uz": document.title = title_uz; break;
      case "oz": document.title = title_oz; break;
    }
  }
}
