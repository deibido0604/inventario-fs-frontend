export const addKey = (data = []) => {
  if (JSON.stringify(data) === JSON.stringify([{}])) {
    return [];
  }
  return data.map((item, index) => ({ ...item, key: (index + 1).toString() }));
};

export const filterDto = (data = []) => {
  return data.flatMap((item) =>
    item.value.map((subItem, index) => {
      return {
        key: index + 1,
        type: item.type,
        value: subItem,
      };
    }),
  );
};

export const mapDto = (inputs) => {
  return inputs.map((input) => ({ label: input.name, value: input._id }));
};

export const countryDto = (inputs) => {
  return inputs.map((input) => ({
    label: input.name,
    value: input.country_code,
  }));
};

export const compisDto = (inputs) => {
  return inputs.map((input) => ({
    label: input.complete_name,
    value: input._id,
  }));
};
