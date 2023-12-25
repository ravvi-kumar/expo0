import { useOAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { Button, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { useWarmUpBrowser } from "../../hooks/warnUpBrowser";

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const [loading, setLoading] = useState(false);

  const onPress = React.useCallback(async () => {
    setLoading(true);
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();
      if (createdSessionId) {
        if (setActive) {
          setActive({ session: createdSessionId });
        } else {
          router.replace("/sign-in");
        }
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <View>
      <Spinner visible={loading} />
      <Button title="Sign in with Google" onPress={onPress} />
    </View>
  );
};
export default SignInWithOAuth;
