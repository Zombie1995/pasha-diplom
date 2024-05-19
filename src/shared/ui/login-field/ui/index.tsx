interface Props {
  title: string;
  type?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  wrong?: boolean;
  wrongText?: string;
}

export const LoginField = ({
  title,
  type = "text",
  onChange,
  wrong = false,
  wrongText = "",
}: Props) => {
  return (
    <div className="relative w-full">
      <p className="text-[12px]">{title}</p>
      <div className="h-[2px]" />
      <input
        style={{ outlineColor: wrong ? "#e74f4f" : "#949cb8" }}
        className="outline outline-[1.5px] outline-[#949cb8] min-h-[40px] w-full rounded-[5px] px-2"
        type={type}
        onChange={onChange}
      />
      {wrong && (
        <div className="absolute pt-1">
          <p className="text-[#e74f4f] text-[12px] font-medium">{wrongText}</p>
        </div>
      )}
    </div>
  );
};
