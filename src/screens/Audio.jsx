import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound, { PlayBackType, PlaybackEndType } from 'react-native-nitro-sound';
import { apiUrl } from '../constants';

const Audio = () => {
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [playTime, setPlayTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchAudios();
    return () => onStopPlay(); // cleanup on unmount
  }, []);

  const fetchAudios = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${apiUrl}/get-audio/${userId}`);
      if (!response.ok) {
        console.log('Failed to fetch audios:', response.status);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setAudios(data || []);
    } catch (error) {
      console.error('Failed to fetch audios', error);
    } finally {
      setLoading(false);
    }
  };

  const onStartPlay = async (audioUrl, id) => {
    if (playingId === id) {
      onStopPlay();
      return;
    }

    onStopPlay(); // stop any existing playback

    // Add playback listeners
    Sound.addPlayBackListener((e) => {
      setCurrentPosition(e.currentPosition);
      setTotalDuration(e.duration);
      setPlayTime(Sound.mmssss(Math.floor(e.currentPosition)));
      setDuration(Sound.mmssss(Math.floor(e.duration)));
    });

    Sound.addPlaybackEndListener((e) => {
      setIsPlaying(false);
      setPlayingId(null);
      setCurrentPosition(0);
    });

    try {
      const result = await Sound.startPlayer(audioUrl);
      console.log('Playback started:', result);
      setPlayingId(id);
      setIsPlaying(true);
    } catch (err) {
      console.log('Failed to start playback:', err);
    }
  };

  const onStopPlay = async () => {
    try {
      await Sound.stopPlayer();
    } catch (err) {
      console.log('Error stopping player:', err);
    }
    Sound.removePlayBackListener();
    Sound.removePlaybackEndListener();
    setIsPlaying(false);
    setPlayingId(null);
    setCurrentPosition(0);
    setTotalDuration(0);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.detail}>Email: {item.sender_email}</Text>
        <Text style={styles.detail}>Phone: {item.sender_phone || 'N/A'}</Text>
        <Text style={styles.detail}>Contact: {item.contact_name}</Text>
        <Text style={styles.detail}>Contact Email: {item.contact_email}</Text>
        <Text style={styles.detail}>Date: {item.created_at}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.playButton,
          playingId === item.audio_id && styles.pauseButton,
        ]}
        onPress={() => onStartPlay(item.voice, item.audio_id)}
      >
        <Text style={styles.playText}>
          {playingId === item.audio_id && isPlaying ? 'Pause' : 'Play'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Messages</Text>

      <FlatList
        data={audios}
        keyExtractor={(item) => item.audio_id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No audio messages found</Text>
        }
      />
    </View>
  );
};

export default Audio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color:"black"
  },
  card: {
    backgroundColor: '#FFF',
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth:1,
    borderColor:"black"
  },
  sender: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  detail: {
    fontSize: 13,
    color: '#6B7280',
  },
  progress: {
    fontSize: 12,
    color: '#2563EB',
    marginTop: 4,
  },
  playButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pauseButton: {
    backgroundColor: '#DC2626',
  },
  playText: {
    color: '#FFF',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#6B7280',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});
