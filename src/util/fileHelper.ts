import { MyFileType } from "../types/product.type";

export const getFileUrl = (path: string) => {
    if(!path)
    {
      return null;
    }

    const image_url = `${import.meta.env.VITE_API_END_POINT}/${path.replace(/\\/g, '/').replace(/ /g, '%20')}`;
    return image_url;
};

export const getBase64 = (file: MyFileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
});

export const generateRandomCode = (length: number = 6): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

export const formatNumber = (value: number): string => {
  // ທົດສະນິຍົມ 0 ຕົວເລກ
  const fixedValue = value.toFixed(0);

  // ຈັດຕົວເລກຫົວພັນ
  return fixedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};