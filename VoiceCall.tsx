import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  ImageBackground,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import { MeetingProvider, useMeeting } from "@videosdk.live/react-native-sdk";
import { createMeeting, token } from "@/api";
import Typography from "@/constants/Typography";
import { SvgXml } from "react-native-svg";
import {
  hungup,
  Record,
  MicOff,
  BackArrow,
  blackArrow,
  CallWhite,
} from "@/components/Icons/Icons";
import { router, useGlobalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import { ThemeContext } from "@/ctx/ThemeContext";

interface JoinScreenProps {
  getMeetingId: (id?: string) => void;
}

const JoinScreen: React.FC<JoinScreenProps> = ({ getMeetingId }) => {
  const [meetingVal, setMeetingVal] = useState("");
  const [meetingFocused, setMeetingFocused] = useState(false);
  const { theme, changeTheme } = useContext(ThemeContext);

  const handleEmailFocus = () => {
    setMeetingFocused(true);
  };

  const handleEmailBlur = () => {
    setMeetingFocused(false);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 50,
        gap: 100,
        backgroundColor: theme === "dark" ? "#181A20" : "white",
      }}
    >
      <View style={styles.backArrow}>
        <TouchableOpacity onPress={() => router.back()}>
          <SvgXml xml={theme === "dark" ? BackArrow : blackArrow} />
        </TouchableOpacity>
      </View>

      <View style={{ justifyContent: "center", alignItems: "center", gap: 30 }}>
        <Image source={require("@/assets/icons/HeartPlus.png")} />

        <TouchableOpacity
          onPress={() => {
            getMeetingId();
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 380,
            height: 58,
            backgroundColor: "#246BFD",
            borderRadius: 100,
          }}
        >
          <Text style={[Typography.bold.large, { color: "#ffffff" }]}>
            Create Room
          </Text>
        </TouchableOpacity>

        <Text style={[Typography.bold.large, { color: "#757575" }]}>OR</Text>

        <View
          style={[
            meetingFocused && styles.inputOneFocused,
            {
              backgroundColor: theme === "dark" ? "#181A20" : "#FAFAFA",
              width: 380,
              borderRadius: 100,
            },
          ]}
        >
          <TextInput
            value={meetingVal}
            onChangeText={setMeetingVal}
            placeholder={"XXXX-XXXX-XXXX"}
            style={[styles.input, meetingFocused && styles.meetingFocused]}
            placeholderTextColor="#9E9E9E"
            onFocus={handleEmailFocus}
            onBlur={handleEmailBlur}
          />
        </View>

        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 380,
            height: 58,
            backgroundColor: "#246BFD",
            borderRadius: 100,
          }}
          onPress={() => {
            getMeetingId(meetingVal);
          }}
        >
          <Text style={[Typography.bold.large, { color: "#ffffff" }]}>
            Join the Room
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputOneFocused: {
    borderColor: "#246BFD",
    borderWidth: 2,
    borderRadius: 100,
    width: 380,
  },
  meetingFocused: {
    color: "#868a94",
    fontSize: 16,
  },
  input: {
    padding: 12,
    borderWidth: 0,
    borderRadius: 6,
    alignSelf: "center",
    fontFamily: "italic",
  },
  Background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    paddingBottom: 48,
    paddingLeft: 24,
    paddingRight: 24,
  },
  backArrow: {
    alignSelf: "flex-start",
  },
});

interface ButtonProps {
  onPress: () => void;
  buttonText: string;
  backgroundColor: string;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  buttonText,
  backgroundColor,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        padding: 12,
        borderRadius: 4,
      }}
    >
      <Text style={{ color: "white", fontSize: 12 }}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

interface ControlsContainerProps {
  join: () => void;
  leave: () => void;
  toggleMic: () => void;
}

const ControlsContainer: React.FC<ControlsContainerProps> = ({
  join,
  leave,
  toggleMic,
}) => {
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const { id, AppointmentID } = useGlobalSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const HandleUpdate = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("appointment")
        .update({ status: "Completed" })
        .eq("id", AppointmentID);
      if (error) {
        console.log(error);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMicPress = () => {
    setIsMicOn((prevState) => !prevState);
  };

  const handleButtonDisable = () => {
    setButtonDisabled(true);
  };
  return (
    <View
      style={{
        padding: 24,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 20,
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: "#F0FFF0",
          borderRadius: 100,
          padding: 23,
          opacity: 0.6,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          join();
          handleButtonDisable();
        }}
        disabled={isButtonDisabled}
      >
        <SvgXml xml={CallWhite} />
      </TouchableOpacity>
      <View
        style={{
          backgroundColor: "#F0FFF0",
          borderRadius: 100,
          padding: 23,
          opacity: 0.6,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            toggleMic();
            handleMicPress();
          }}
        >
          <SvgXml xml={isMicOn ? Record : MicOff} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{ backgroundColor: "#F75555", borderRadius: 100, padding: 20 }}
        onPress={() => {
          leave();
          HandleUpdate();
          router.push({
            pathname: "(app)/Appointments/VoiceCallAppointment/SessionEnded",
            params: { id: id },
          });
        }}
      >
        <SvgXml xml={hungup} />
      </TouchableOpacity>
    </View>
  );
};

interface ParticipantViewProps {
  participantId: string;
  meetingId: string | null;
}

interface Doctors {
  first_name: string;
  last_name: string;
  created_at: string;
  image: string;
  id: string;
}

type FetchDoctor = Doctors | null;
type FetchError = string | null;

const tableName = "doctors";

const ParticipantView: React.FC<ParticipantViewProps> = ({ participantId }) => {
  const [FetchDoctor, setFetchDoctor] = useState<FetchDoctor>(null);
  const [FetchError, setFetchError] = useState<FetchError>(null);
  const { id } = useGlobalSearchParams();
  useEffect(() => {
    const FetchDoctors = async () => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .eq("id", `${id}`)
          .single();

        if (data) {
          setFetchDoctor(data);
          setFetchError(null);
        }

        if (error) {
          setFetchDoctor(null);
          setFetchError("could not fetch description articles in database");
          return null;
        }
      } catch (error) {
        console.error(error);
        setFetchError("An unexpected error occurred");
        return null;
      }
    };
    FetchDoctors();
  }, []);

  return (
    <View
      style={{
        paddingTop: 50,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {FetchError && <Text>{FetchError}</Text>}

      {FetchDoctor && (
        <View
          style={{ justifyContent: "center", alignItems: "center", gap: 24 }}
        >
          <Image
            source={{ uri: FetchDoctor.image }}
            style={{ width: 200, height: 200, borderRadius: 100 }}
          />

          <View
            style={{ justifyContent: "center", alignItems: "center", gap: 24 }}
          >
            <Text style={[Typography.heading._3, { color: "#FFFFFF" }]}>
              {FetchDoctor.first_name} {FetchDoctor.last_name}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

interface ParticipantListProps {
  participants: string[];
  meetingId: string | null;
}

const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  meetingId,
}) => {
  const [FetchDoctor, setFetchDoctor] = useState<FetchDoctor>(null);
  const [FetchError, setFetchError] = useState<FetchError>(null);
  const { id } = useGlobalSearchParams();
  useEffect(() => {
    const FetchDoctors = async () => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .eq("id", `${id}`)
          .single();

        if (data) {
          setFetchDoctor(data);
          setFetchError(null);
        }

        if (error) {
          setFetchDoctor(null);
          setFetchError("could not fetch description articles in database");
          return null;
        }
      } catch (error) {
        console.error(error);
        setFetchError("An unexpected error occurred");
        return null;
      }
    };
    FetchDoctors();
  }, []);

  return participants.length > 0 ? (
    <View style={{ justifyContent: "center", alignItems: "center", gap: 10 }}>
      <ParticipantView participantId={participants[0]} meetingId={meetingId} />
    </View>
  ) : (
    <View
      style={{
        paddingTop: 50,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ justifyContent: "center", alignItems: "center", gap: 24 }}>
        {FetchError && <Text>{FetchError}</Text>}

        {FetchDoctor && (
          <View
            style={{ justifyContent: "center", alignItems: "center", gap: 24 }}
          >
            <Image
              source={{ uri: FetchDoctor.image }}
              style={{ width: 200, height: 200, borderRadius: 100 }}
            />

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                gap: 24,
              }}
            >
              <Text style={[Typography.heading._3, { color: "#FFFFFF" }]}>
                {FetchDoctor.first_name} {FetchDoctor.last_name}
              </Text>
            </View>
          </View>
        )}

        <Text style={[Typography.medium.xLarge, { color: "#FFFFFF" }]}>
          Tap to call
        </Text>
      </View>
    </View>
  );
};

const MeetingView: React.FC<{
  meetingId: string | null;
  appointmentId: string | null;
}> = ({ meetingId, appointmentId }) => {
  const { join, leave, toggleMic, participants } = useMeeting({});
  const participantsArrId = [...participants.keys()];

  const [participantJoinedMessage, setParticipantJoinedMessage] = useState("");

  useEffect(() => {
    const fetchMeetingId = async () => {
      if (appointmentId) {
        const { data, error } = await supabase
          .from("appointment")
          .select("meetingId")
          .eq("id", appointmentId)
          .single();

        if (error) {
          console.error("Error fetching meeting ID:", error);
        } else {
          console.log("Meeting ID fetched:", data.meetingId);
        }
      }
    };

    fetchMeetingId();
  }, [appointmentId]);

  useEffect(() => {
    if (participantsArrId.length === 2) {
      setParticipantJoinedMessage("Doctor has joined the call.");
    } else {
      setParticipantJoinedMessage(""); 
    }
  }, [participantsArrId]);

  return (
    <ImageBackground
      style={styles.Background}
      resizeMode="cover"
      source={require("@/assets/images/Background.png")}
    >
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <ParticipantList
          participants={participantsArrId}
          meetingId={meetingId}
        />

        <View>
          {participantJoinedMessage ? (
            <Text
              style={{
                color: "white",
                fontSize: 16,
                textAlign: "center",
                marginVertical: 10,
              }}
            >
              {participantJoinedMessage}
            </Text>
          ) : null}
        </View>

        <ControlsContainer join={join} leave={leave} toggleMic={toggleMic} />
      </View>
    </ImageBackground>
  );
};

const VoiceCall: React.FC = () => {
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const { AppointmentID } = useGlobalSearchParams();

  const getMeetingId = async (id?: string) => {
    const newMeetingId = id == null ? await createMeeting({ token }) : id;
    setMeetingId(newMeetingId);
    if (newMeetingId) {
      try {
        const { error } = await supabase
          .from("appointment")
          .update({ meetingId: newMeetingId })
          .eq("id", AppointmentID);
        if (error) {
          console.error("Error updating meeting ID:", error);
        }
      } catch (error) {
        console.error("Unexpected error updating meeting ID:", error);
      }
    }
  };

  return meetingId ? (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F6FF" }}>
      <MeetingProvider
        config={{
          meetingId,
          micEnabled: true,
          webcamEnabled: false,
          name: "Patient",
        }}
        token={token}
      >
        <MeetingView meetingId={meetingId} appointmentId={null} />
      </MeetingProvider>
    </SafeAreaView>
  ) : (
    <JoinScreen getMeetingId={getMeetingId} />
  );
};

export default VoiceCall;
