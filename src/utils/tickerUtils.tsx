export const cleanTickerName = (name:string|null) => {
    if (!name) return '';
    return name.replace(/\b(common|stock|class A|shares|ordinary)\b/gi, '').trim();
  };
  