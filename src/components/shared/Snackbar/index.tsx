import * as React from 'react';

import { Animated, Dimensions, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

import styled from 'styled-components/native';

const { width } = Dimensions.get('screen');
const maxWidth = width - 32;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    minWidth: 150,
    maxWidth,
    textAlign: 'left',
    alignItems: 'center',
    position: 'absolute',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    bottom: 50,
    backgroundColor: '#303235',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

const ActionContainer = styled.View`
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: -5px;
  padding-left: 16px;
`;

const Touchable = styled.TouchableOpacity``;

const ActionButton = styled.View`
  padding: 4px 4px 2px 2px;
`;

export interface SnackbarProps {
  testID?: string;
  ref?: React.MutableRefObject<SnackbarRef>;
}

interface Content {
  text: string;
  actionText?: string;
  timer?: Timer;
  actionStyle?: TextStyle;
  containerStyle?: ViewStyle;
  messageStyle?: TextStyle;
  onPressAction?: () => void;
}

interface ShowingState {
  isVisible?: boolean;
  isShowing?: boolean;
  timeout?: NodeJS.Timeout;
}

export interface SnackbarRef {
  show(content: Content): void;
}

export enum Timer {
  SHORT = 1500,
  LONG = 3000,
}

const Snackbar: React.FC<SnackbarProps> = React.forwardRef<SnackbarRef, SnackbarProps>((props, ref) => {
  const { testID } = props;
  const [showingState, setShowingState] = React.useState<ShowingState>({ isVisible: false, isShowing: false });
  const [content, setContent] = React.useState<Content>({ text: '', timer: Timer.SHORT });
  const { text, actionText, messageStyle, actionStyle, containerStyle, timer = Timer.SHORT, onPressAction } = content;
  const { isShowing, isVisible, timeout } = showingState;
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const show = (content: Content): void => {
    setContent(content);
    timeout && clearTimeout(timeout);
    setShowingState((prevState) => ({ ...prevState, isShowing: true }));
  };
  const hide = (duration = 200): void => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 0,
        duration: duration,
      },
    ).start(() => setShowingState((prevState) => ({ ...prevState, isVisible: false })));
  };
  React.useEffect(() => {
    if (isShowing) {
      if (isVisible) {
        hide(50);
      } else {
        const timeout = setTimeout(() => {
          hide();
        }, timer + 200);
        setShowingState({ isShowing: false, isVisible: true, timeout });
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 200,
          },
        ).start();
      }
    }
  }, [showingState]);
  React.useImperativeHandle(ref, () => ({
    show,
  }));
  return (
    <>
      {showingState.isVisible && (
        <Animated.View testID={testID} style={[styles.container, containerStyle, { opacity: fadeAnim }]}>
          <Text style={messageStyle}>{text}</Text>
          {actionText && (
            <ActionContainer>
              <Touchable onPress={onPressAction}>
                <ActionButton>
                  <Text style={actionStyle}>{actionText}</Text>
                </ActionButton>
              </Touchable>
            </ActionContainer>
          )}
        </Animated.View>
      )}
    </>
  );
});

export default Snackbar;
