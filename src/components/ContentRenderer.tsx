import type { MarkdownElement } from '../features/markdown/Types';

export interface ContentRendererProps {
  readonly elements: MarkdownElement[];
}

export function ContentRenderer({ elements }: ContentRendererProps): React.ReactNode {
  return (
    <box>
      {elements.map((element, index) => {
        if (element.type === 'header') {
          return <text key={index}>{element.content}</text>;
        }
        if (element.type === 'paragraph') {
          return <text key={index}>{element.content}</text>;
        }
        if (element.type === 'bullet_list') {
          return (
            <box key={index}>
              {element.items.map((item, itemIndex) => (
                <text key={itemIndex}>{item}</text>
              ))}
            </box>
          );
        }
        if (element.type === 'numbered_list') {
          return (
            <box key={index}>
              {element.items.map((item, itemIndex) => (
                <text key={itemIndex}>{item}</text>
              ))}
            </box>
          );
        }
        return null;
      })}
    </box>
  );
}
