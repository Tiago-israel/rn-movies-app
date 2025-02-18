import Icon from "@expo/vector-icons/FontAwesome";
import { Box } from "@/components/Box";
import { useTheme } from "@/lib/theme-provider";
import { MovieTheme } from "../theme";

type PillProps = {
  children?: string;
  icon?: any;
};

export function Pill(props: PillProps) {
  const { colors } = useTheme<MovieTheme>();
  return (
    <Box
      height={36}
      px="sm"
      flexDirection="row"
      backgroundColor="secondary"
      borderRadius="full"
      alignItems="center"
      gap={"xxs"}
      justifyContent="center"
    >
      {props.icon && (
        <Icon name={props.icon || "han"} size={24} color={colors.onSecondary} />
      )}

      <Box as="Text" color={colors.onSecondary} fontSize={14} fontWeight={700}>
        {props.children}
      </Box>
    </Box>
  );
}
