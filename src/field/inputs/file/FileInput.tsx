import { Button, InputGroup } from "@chakra-ui/react";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFormContext } from "../../../Form";
import { useFormFieldContext } from "../../FormField";

function humanizeBytes(bytes: number) {
  if (bytes < 1024) {
    return bytes + " B";
  } else if (bytes < 1048576) {
    return (bytes / 1024).toFixed(1) + " KB";
  } else if (bytes < 1073741824) {
    return (bytes / 1048576).toFixed(1) + " MB";
  } else {
    return (bytes / 1073741824).toFixed(1) + " GB";
  }
}

const FileInputContext = createContext<File[]>([]);

export const useFiles = () => useContext(FileInputContext);

/**
 * File input
 */
export function FileInput(props: PropsWithChildren<FileInputProps>) {
  const context = useFormFieldContext(),
    formContext = useFormContext(),
    ref = useRef<HTMLInputElement | null>(null);

  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    formContext.setField(context.id, files, {});
  }, [files]);

  return (
    <InputGroup
      onClick={() => {
        ref.current!.click();
      }}
      cursor="pointer"
      w="auto"
    >
      <input
        type="file"
        name={`${formContext?.id}-${context?.id}`}
        aria-required={context?.required}
        accept={props.accept}
        multiple={props.multiple}
        hidden
        ref={(e) => {
          ref.current = e;
        }}
        onChange={(e) => {
          console.log(e);

          if (e.target.files) {
            const files = Array.from(e.target.files);

            for (const file of files) {
              if (!file) continue;

              if (file.size >= props.maxSize) {
                props.aboveMaxSize(humanizeBytes(props.maxSize));

                e.target.value = null as any;
                return;
              }
            }

            setFiles(files);
          }
        }}
      />
      <FileInputContext.Provider value={files}>
        {props.children}
      </FileInputContext.Provider>
    </InputGroup>
  );
}

export interface FileInputProps {
  inputRef?: React.Ref<HTMLInputElement>;
  accept?: string;
  multiple?: boolean;
  maxSize: number;
  /**
   * Handle showing the user that a file was above the maximum size
   */
  aboveMaxSize: (sizeStr: string) => void;
}
