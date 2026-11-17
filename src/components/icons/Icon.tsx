import Svg, { Path } from 'react-native-svg';

export type IconName = 'home' | 'collection';

interface IconProps {
  name: IconName;
  size?: number;
  color: string;
}

// Minimal custom SVG icon set (react-native-svg, no vector-icons font).
export function Icon({ name, size = 24, color }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round">
      {name === 'home' ? (
        <>
          <Path d="M3 9 L12 2 L21 9" />
          <Path d="M5 9v13c0 .55228.44772 1 1 1h12c.5523 0 1-.44772 1-1V9" />
        </>
      ) : (
        <>
          <Path d="M12 2 L2 7 L12 12 L22 7 Z" />
          <Path d="M2 17 L12 22 L22 17" />
          <Path d="M2 12 L12 17 L22 12" />
        </>
      )}
    </Svg>
  );
}
