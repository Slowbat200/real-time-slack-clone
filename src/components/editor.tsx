/* The import statements at the beginning of the code are used to bring in various modules, components,
and utilities that are needed in the `Editor` component. Here is a breakdown of what each import
statement is doing: */
import { Delta, Op } from 'quill/core';
import Quill, { QuillOptions } from 'quill';
import 'quill/dist/quill.snow.css';

import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { Button } from './ui/button';

import { PiTextAa } from 'react-icons/pi';
import { MdSend } from 'react-icons/md';
import { ImageIcon, Smile, XIcon } from 'lucide-react';

import { EmojiPopover } from './emoji-popover';
import { Hint } from './hint';

import { cn } from '@/lib/utils';

import Image from 'next/image';

/**
 * The type `EditorValue` in TypeScript React represents an editor value with an image file and a body
 * string.
 * @property {File | null} image - The `image` property in the `EditorValue` type represents an image
 * file that can be either a `File` object or `null`.
 * @property {string} body - The `body` property in the `EditorValue` type represents a string that
 * typically contains the textual content of an editor, such as a text editor or a rich text editor. It
 * can include any text content that the user inputs or edits.
 */
type EditorValue = {
  image: File | null;
  body: string;
};

/* The `interface EditorProps` in the TypeScript React code snippet is defining the props that can be
passed to the `Editor` component. Here is a breakdown of each property defined in the interface: 

/*The line `onSubmit: ({ image, body }: EditorValue) => void;` in the `EditorProps` interface is
defining a prop called `onSubmit` that is a function expecting an object with properties `image` and
`body` of type `EditorValue`. This function is used to handle the submission of the editor content,
where `image` represents an image file (or null) and `body` represents the textual content of the
editor. The function returns `void`, indicating that it does not return any value. */

/*The `onCancel?: () => void;` in the `EditorProps` interface is defining an optional prop called
`onCancel`. This prop is a function that takes no arguments and returns `void`. It is used to handle
the action when the user cancels or closes the editor component. */

/* The line `placeholder?: string;` in the `EditorProps` interface is defining a prop called
`placeholder` that is optional and can accept a string value. This prop allows the parent component
using the `Editor` component to provide a placeholder text that will be displayed in the editor
component when there is no content present. If no placeholder text is provided, the default value
`'Write something'` will be used. */

/* The line `defaultValue?: Delta | Op[];` in the `EditorProps` interface is defining a prop called
`defaultValue` that is optional and can accept either a `Delta` object or an array of `Op` objects. */

/* The `innerRef?: MutableRefObject<Quill | null>;` in the `EditorProps` interface is defining a prop
called `innerRef` that is of type `MutableRefObject<Quill | null>`. This prop allows the parent
component using the `Editor` component to pass a mutable reference object that can hold a reference
to a Quill editor instance or be `null`. */

/* The line `variant?: 'create' | 'update';` in the `EditorProps` interface is defining a prop called
`variant` that can accept one of two specific string values: `'create'` or `'update'`. This means
that when using the `Editor` component, the `variant` prop must be either `'create'` or `'update'`,
and any other string value will result in a type error. */

interface EditorProps {
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  variant?: 'create' | 'update';
}
// Here I'm passing all of the props from EditorProps Interface so I can use them later in other component
const Editor = ({
  onCancel,
  onSubmit,
  placeholder = 'Write something',
  defaultValue = [],
  disabled = false,
  innerRef,
  variant = 'create',
}: EditorProps) => {
  /* The lines `const [text, setText] = useState('');` and `const [isToolbarVisible, setIsToolbarVisible]
= useState(true);` in the `Editor` component are initializing two state variables using the
`useState` hook provided by React. */
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  /* The above code is using the `useRef` hook in React to create a reference to the `onSubmit`
  function. This reference can be used to access the function and call it later on, for example, in
  a form submission handler. */
  const submitRef = useRef(onSubmit);

  /* The above code is using the `useRef` hook in React to create a reference to the `placeholder`
variable. This reference can be used to access and manipulate the `placeholder` value in the React
component. */
  const placeholderRef = useRef(placeholder);

  /* The above code is using the `useRef` hook from React to create a reference to a Quill editor
instance. The `useRef` hook is being initialized with a type annotation `<Quill | null>` to specify
that the reference can hold either a Quill editor instance or `null`. This reference can be used to
access and manipulate the Quill editor instance in a TypeScript React component. */
  const quilRef = useRef<Quill | null>(null);

  /* The above code is using the `useRef` hook in React to create a reference to the `defaultValue`
variable. This reference is stored in the `defaultValueRef` variable. This can be useful for
accessing and updating the `defaultValue` value in a functional component without causing a
re-render. */
  const defaultValueRef = useRef(defaultValue);

  /* The above code is using the `useRef` hook from React to create a reference to a `HTMLDivElement`
element. The `containerRef` variable will hold a reference to the `HTMLDivElement` element, and it
is initialized with a value of `null`. This reference can be used to access and manipulate the
`HTMLDivElement` element in the React component. */
  const containerRef = useRef<HTMLDivElement>(null);

  /* The above code snippet is written in TypeScript and React. It is using the `useRef` hook to create
  a reference called `disabledRef` that is initialized with the value of `disabled`. The `disabled`
  variable is assumed to be defined elsewhere in the code. This reference can be used to access and
  update the `disabled` value in a functional component. */
  const disabledRef = useRef(disabled);

  const imageElementRef = useRef<HTMLInputElement>(null);

  /* The above code snippet is using the `useLayoutEffect` hook in a TypeScript React component. Inside
the `useLayoutEffect` callback function, it is assigning values to different refs (`submitRef`,
`placeholderRef`, `defaultValueRef`, `disabledRef`) based on the values of `onSubmit`,
`placeholder`, `defaultValue`, and `disabled` respectively. This allows the component to keep track
of these values and potentially trigger re-renders or other side effects based on changes to these
values. */
  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  /* The above code snippet is using the `useEffect` hook in a TypeScript React component. The
`useEffect` hook is used to perform side effects in function components. In this case, the
`useEffect` hook is being used to run some code when the component mounts or updates. */
  useEffect(() => {
    /* The above code is a TypeScript React snippet that checks if the `containerRef.current` is falsy
  (null, undefined, etc.). If it is falsy, the code immediately returns from the current function or
  block. This is a common pattern used to guard against accessing properties or methods on null or
  undefined values to prevent potential errors. */
    if (!containerRef.current) return;

    /* The code snippet is attempting to access the current value of the `containerRef` using the `current`
property and assigning it to the `container` variable in a TypeScript React component. */
    const container = containerRef.current;

    /* The above code is creating a new `<div>` element and appending it to the `container` element. */
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement('div')
    );

    /* The `const options: QuillOptions` object is configuring the options for the Quill editor instance
   that will be created within the `Editor` component. Here is a breakdown of what each property in
   the `options` object is doing: */
    const options: QuillOptions = {
      theme: 'snow',

      /* The line `placeholder: placeholderRef.current` in the `options` object within the `Editor` component
is setting the placeholder text for the Quill editor instance. The text of the placeholder is defined on the line 82, where Im passing all the props from the interface*/
      placeholder: placeholderRef.current,
      modules: {
        /* The `toolbar` configuration in the Quill editor options is defining the formatting options
       that will be displayed in the editor's toolbar. Each array within the `toolbar` array
       represents a group of formatting options that will be displayed together in the toolbar. Without it shows a default formatting options, for example 
       (types of headings, underline or indexes), but here I can define what I want to be visible in the editor header.*/
        toolbar: [
          ['bold', 'italic', 'strike'],
          ['link'],
          [{ list: 'ordered' }, { list: 'bullet' }],
        ],

        //  Here I defined my keyboard key options.
        keyboard: {
          bindings: {
            // Here I defining that if I click on the enter it will do nothing
            enter: {
              key: 'Enter',
              handler:() => {
                return false
              }
            },
            // But if I click on shift + enter it will create a new empty line (e.g. handler)
            shift_enter: {
              key: 'Enter',
              shiftKey: true,
              handler: () => {
                /* The line `quill.insertText(quill.getSelection()?.index || 0, '\n');` in the code
                snippet is handling the behavior when the user presses "Shift + Enter" in the Quill
                editor instance. */
                quill.insertText(quill.getSelection()?.index || 0, '\n');
              },
            },
          },
        },
      },
    };
    /* The line `const quill = new Quill(editorContainer, options);` in the `Editor` component is
   creating a new instance of the Quill editor within the specified `editorContainer` element with
   the provided configuration options `options`. */
    const quill = new Quill(editorContainer, options);

    /* The line `quilRef.current = quill;` in the `Editor` component is assigning the current Quill editor
 instance (`quill`) to the `quilRef.current` reference. This allows the `quilRef` to hold a
 reference to the Quill editor instance, which can be accessed and utilized elsewhere in the
 component or by parent components if needed. This reference can be useful for interacting with the
 Quill editor instance programmatically, such as accessing its methods or properties outside of the
 component's scope. */
    quilRef.current = quill;

    /* The above code is attempting to focus on the element referenced by `quilRef` using the `focus()`
   method. This is typically used in React applications to bring user attention to a specific input
   field or element on the page. */
    quilRef.current.focus();

    /* In this if condition Im checking if the innerRef from interface is existing, if yes it will set the `current` property of the `innerRef` object to the `quill`
      object. This is commonly done in React applications to establish a reference to a DOM element
      or another object within a component. */
    if (innerRef) {
      innerRef.current = quill;
    }

    /* The above code is setting the contents of a Quill editor to the value stored in
`defaultValueRef.current`. This is typically used to initialize the Quill editor with some default
content. */
    quill.setContents(defaultValueRef.current);

    /* The above code is setting the text content of a Quill editor to the result of the
    `quill.getText()` function call. */
    setText(quill.getText());

    /* The above code is using the Quill editor to listen for text change events. When a text change
  event occurs, the code updates the state with the new text content from the Quill editor by
  calling the `setText` function with the text obtained from `quill.getText()`. */
    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    /* The above code is a React functional component that returns a function. Inside the function, it
   is handling cleanup tasks related to a Quill editor instance. */
    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = '';
      }
      if (quilRef.current) {
        quilRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  /**
   * The function `toggleToolbar` toggles the visibility of a toolbar element in a React component.
   */
  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current);
    const toolbarElement = containerRef.current?.querySelector('.ql-toolbar');

    /** In this condition Im checking if the toolbarElement is existing if yes it toggle it on hidden */
    if (toolbarElement) {
      toolbarElement.classList.toggle('hidden');
    }
  };

  const onEmojiSelect = (emoji: any) => {
    const quill = quilRef.current;

    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
  };

  /* The above code is checking if the `text` variable is empty after removing any HTML tags from it. It
uses a regular expression to replace any HTML tags with an empty string, then trims the resulting
text and checks if its length is 0, indicating that the text is empty. */
  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

  console.log({ isEmpty, text });
  return (
    <div className='flex flex-col'>
      <input
        type='file'
        accept='image/*'
        ref={imageElementRef}
        onChange={(event) => setImage(event.target.files![0])}
        className='hidden'
      />
      <div
        className={cn(
          'flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white text-black',
          disabled && 'opacity-50'
        )}
      >
        <div ref={containerRef} className='h-full ql-custom' />
        {!!image && (
          <div className='p-2'>
            <div className='relative size-[62px] flex items-center justify-center group/image'>
              <Hint label='Remove Image'>
                <button
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = '';
                  }}
                  className='hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center'
                >
                  <XIcon className='size-3.5' />
                </button>
              </Hint>
              <Image
                src={URL.createObjectURL(image)}
                alt='Uploaded'
                fill
                className='rounded-xl overflow-hidden border object-cover'
              />
            </div>
          </div>
        )}
        <div className='flex px-2 pb-2 z-[5]'>
          <Hint
            /* The above code is setting the label of a component based on the value of the
            `isToolbarVisible` variable. If `isToolbarVisible` is true, the label will be set to
            'Hide formatting', otherwise it will be set to 'Show formatting'. This is commonly used
            in React components to dynamically update the text displayed based on certain
            conditions. */
            label={isToolbarVisible ? 'Hide formatting' : 'Show formatting'}
          >
            <Button
              disabled={disabled}
              size='iconSm'
              variant='ghost'
              onClick={toggleToolbar}
            >
              <PiTextAa className='size-4' />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button disabled={disabled} size='iconSm' variant='ghost'>
              <Smile className='size-4' />
            </Button>
          </EmojiPopover>
          {variant === 'create' && (
            <Hint label='Image'>
              <Button
                disabled={disabled}
                size='iconSm'
                variant='ghost'
                onClick={() => imageElementRef.current?.click()}
              >
                <ImageIcon className='size-4' />
              </Button>
            </Hint>
          )}
          {/** This code works same as a code bellow but I didnt create a edit function for it yet */}
          {variant === 'update' && (
            <div className='ml-auto flex items-center gap-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={onCancel}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                disabled={disabled || isEmpty}
                onClick={() => {
                  onSubmit({
                    body: JSON.stringify(quilRef.current?.getContents()),
                    image,
                  });
                }}
                size='sm'
                className='bg-[#007a5a] hover:bg-[#007a5a]/80 text-white'
              >
                Save
              </Button>
            </div>
          )}
          {/* This part od code is called from the iterface where I set that the variant will be create or update that means when the editor is create (is empty) 
          it will create a Button with a white background, white background while hovering, and gray text style. 
          But if I type something it will change for a update and it will create a green background and green background while hovering style.*/}
          {variant === 'create' && (
            <Button
              className={cn(
                'ml-auto',
                isEmpty
                  ? 'bg-[#ffffff] hover:bg-[#ffffff]/80 text-muted-foreground'
                  : ' bg-[#007a5a] hover:bg-[#007a5a]/80 text-white'
              )}
              size='iconSm'
              disabled={disabled || isEmpty}
              onClick={() => {
                onSubmit({
                  body: JSON.stringify(quilRef.current?.getContents()),
                  image,
                });
              }}
            >
              <MdSend className='size-4' />
            </Button>
          )}
        </div>
      </div>
      {variant === 'create' && (
        <div
          className={cn(
            'p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition',
            !isEmpty && 'opacity-100'
          )}
        >
          <p>
            <strong>Shift + Enter</strong> to add a new line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
