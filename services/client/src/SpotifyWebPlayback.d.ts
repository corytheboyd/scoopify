import Player = SpotifyWebPlayback.Player;

declare namespace SpotifyWebPlayback {
  interface PlayerEvent {}

  interface WebPlaybackPlayer extends PlayerEvent {
    readonly device_id: string;
  }

  interface WebPlaybackError extends PlayerEvent {
    readonly message: string;
  }

  interface PlayerEventMap {
    /**
     * Emitted when the Web Playback SDK has successfully connected and is ready to stream content in the browser from Spotify.
     *
     * @example
     * player.addListener('ready', ({ device_id }) => {
     *   console.log('Connected with Device ID', device_id);
     * });
     * */
    ready: WebPlaybackPlayer;

    /**
     * Emitted when the Web Playback SDK is not ready to play content, typically due to no internet connection.
     *
     * @example
     * player.addListener('not_ready', ({ device_id }) => {
     *   console.log('Device ID is not ready for playback', device_id);
     * });
     * */
    not_ready: WebPlaybackPlayer;

    /**
     * Emitted when the state of the local playback has changed. It may be also executed in random intervals.
     *
     * @example
     * player.addListener('player_state_changed', ({
     *   position,
     *   duration,
     *   track_window: { current_track }
     * }) => {
     *   console.log('Currently Playing', current_track);
     *   console.log('Position in Song', position);
     *   console.log('Duration of Song', duration);
     * });
     * */
    player_state_changed: WebPlaybackState;

    /**
     * Emitted when playback is prohibited by the browser’s autoplay rules. Check Spotify.Player#activateElement for more information.
     *
     * @see https://developer.spotify.com/documentation/web-playback-sdk/reference/#api-spotify-player-activateelement
     *
     * @example
     * player.addListener('autoplay_failed', () => {
     *   console.log('Autoplay is not allowed by the browser autoplay rules');
     * });
     * */
    autoplay_failed: null;

    /**
     * Emitted when the Spotify.Player fails to instantiate a player capable of playing content in the current environment. Most likely due to the browser not supporting EME protection.
     *
     * @example
     * player.on('initialization_error', ({ message }) => {
     *   console.error('Failed to initialize', message);
     * });
     * */
    initialization_error: WebPlaybackError;

    /**
     * Emitted when the Spotify.Player fails to instantiate a valid Spotify connection from the access token provided to getOAuthToken.
     *
     * @example
     * player.on('authentication_error', ({ message }) => {
     *   console.error('Failed to authenticate', message);
     * });
     * */
    authentication_error: WebPlaybackError;

    /**
     * Emitted when the user authenticated does not have a valid Spotify Premium subscription.
     *
     * @example
     * player.on('account_error', ({ message }) => {
     *   console.error('Failed to validate Spotify account', message);
     * });
     * */
    account_error: WebPlaybackError;

    /**
     * Emitted when loading and/or playing back a track failed.
     *
     * @example
     * player.on('playback_error', ({ message }) => {
     *   console.error('Failed to perform playback', message);
     * });
     * */
    playback_error: WebPlaybackError;
  }

  type JSONPrimitive = string | number | boolean | null;
  type JSONObject = { [member: string]: JSONValue };
  interface JSONArray extends Array<JSONValue> {}
  type JSONValue = JSONPrimitive | JSONObject | JSONArray;

  /**
   * A proprietary Spotify URI of the format "spotify:album:xxx", etc.
   * */
  type SpotifyUri = string;

  /**
   * An actual URL pointing to a resource on the web (not to be confused with SpotifyUri)
   * */
  type WebUrl = string;

  /**
   * This is an object that is provided inside track_window from the WebPlaybackState Object. Track objects are Spotify Web API compatible objects containing metadata on Spotify content.
   *
   * @see https://developer.spotify.com/documentation/web-api
   * */
  type WebPlaybackTrack = {
    uri: SpotifyUri;
    id: string | null;
    type: "track" | "episode" | "ad";
    media_type: "audio" | "video";
    name: string;
    is_playable: boolean;
    album: {
      uri: SpotifyUri;
      name: string;
      images: [{ url: WebUrl }];
    };
    artists: [{ uri: SpotifyUri; name: string }];
  };

  /**
   * This is an object that is provided inside track_window from the WebPlaybackState Object. Track objects are Spotify Web API compatible objects containing metadata on Spotify content.
   * */
  type WebPlaybackState = {
    context: {
      uri: SpotifyUri;
      metadata: JSONValue;
    };

    // A simplified set of restriction controls for The current track. By default, these fields will either be set to
    // false or undefined, which indicates that the particular operation is allowed. When the field is set to `true`,
    // this means that the operation is not permitted. For example, `skipping_next`, `skipping_prev` and `seeking` will
    // be set to `true` when playing an ad track.
    disallows: {
      pausing: boolean | undefined;
      peeking_next: boolean | undefined;
      peeking_prev: boolean | undefined;
      resuming: boolean | undefined;
      seeking: boolean | undefined;
      skipping_next: boolean | undefined;
      skipping_prev: boolean | undefined;
    };
    paused: false;

    // The position_ms of the current track.
    position: 0;

    // The repeat mode. No repeat mode is 0,
    // repeat context is 1 and repeat track is 2.
    repeat_mode: 0 | 1 | 2;

    // True if shuffled, false otherwise.
    shuffle: false;

    track_window: {
      // The track currently on local playback
      current_track: WebPlaybackTrack;

      // Previously played tracks. Number can vary.
      previous_tracks: WebPlaybackTrack[];

      // Tracks queued next. Number can vary.
      next_tracks: WebPlaybackTrack[];
    };
  };

  interface Player {
    new (options: {
      name: string;
      getOAuthToken: (cb: (token: string) => void) => void;
      volume: number;
    }): Player;

    /**
     * Connect our Web Playback SDK instance to Spotify with the credentials provided during initialization.
     *
     * Returns a Promise containing a Boolean (either true or false) with the success of the connection.
     *
     * @see https://developer.spotify.com/documentation/web-playback-sdk/reference/#initializing-the-sdk
     *
     * @example
     * player.connect().then(success => {
     *   if (success) {
     *     console.log('The Web Playback SDK successfully connected to Spotify!');
     *   }
     * })
     * */
    connect: () => Promise<boolean>;

    /**
     * Closes the current session our Web Playback SDK has with Spotify.
     *
     * @example
     * player.disconnect()
     * */
    disconnect: () => void;

    /**
     * Create a new event listener in the Web Playback SDK. Alias for Spotify.Player#on.
     *
     * Returns a Boolean. Returns true if the event listener for the event_name is unique. See #removeListener for removing existing listeners.
     *
     * @see https://developer.spotify.com/documentation/web-playback-sdk/reference/#events
     * @see https://developer.spotify.com/documentation/web-playback-sdk/reference/#api-spotify-player-removelistener
     *
     * @example
     * player.addListener('ready', ({ device_id }) => {
     *   console.log('The Web Playback SDK is ready to play music!');
     *   console.log('Device ID', device_id);
     * })
     * */
    addListener<EventType extends keyof PlayerEventMap>(
      eventName: EventType,

      // A callback function to be fired when the event has been executed.
      callback: (event: PlayerEventMap[EventType]) => void
    ): boolean;

    /**
     * @see #addListener
     * */
    on<EventType extends keyof PlayerEventMap>(
      // A valid event name. See Web Playback SDK Events.
      eventName: EventType,

      // A callback function to be fired when the event has been executed.
      callback: (event: PlayerEventMap[EventType]) => void
    ): boolean;

    /**
     * Remove an event listener in the Web Playback SDK.
     *
     * Returns a Boolean. Returns true if the event name is valid with registered callbacks from #addListener.
     *
     * @see https://developer.spotify.com/documentation/web-playback-sdk/reference/#events
     * @see https://developer.spotify.com/documentation/web-playback-sdk/reference/#api-spotify-player-addlistener
     *
     * @example
     * // Removes all "ready" events
     * player.removeListener('ready');
     * // Remove a specific "ready" listener
     * player.removeListener('ready', yourCallback)
     * */
    removeListener<EventType extends keyof PlayerEventMap>(
      // A valid event name. See Web Playback SDK Events.
      eventName: EventType,

      // 	The callback function you would like to remove from the listener. If not provided, it will remove all callbacks under the event_name.
      callback?: (event: PlayerEventMap[EventType]) => void
    ): boolean;

    /**
     * Collect metadata on local playback.
     *
     * Returns a Promise. It will return either a WebPlaybackState object or null depending on if the user is successfully connected.
     *
     * @example
     * player.getCurrentState().then(state => {
     *   if (!state) {
     *     console.error('User is not playing music through the Web Playback SDK');
     *     return;
     *   }
     *
     *   var current_track = state.track_window.current_track;
     *   var next_track = state.track_window.next_tracks[0];
     *
     *   console.log('Currently Playing', current_track);
     *   console.log('Playing Next', next_track);
     * });
     * */
    getCurrentState: () => Promise<WebPlaybackState | null>;

    /**
     * Rename the Spotify Player device. This is visible across all Spotify Connect devices.
     *
     * @example
     * player.setName("My New Player Name").then(() => {
     *   console.log('Player name updated!');
     * });
     * */
    setName: (name: string) => Promise<void>;

    /**
     * Get the local volume currently set in the Web Playback SDK.
     *
     * Returns a Promise containing the local volume (as a Float between 0 and 1).
     *
     * @example
     * player.getVolume().then(volume => {
     *   let volume_percentage = volume * 100;
     *   console.log(`The volume of the player is ${volume_percentage}%`);
     * });
     * */
    getVolume: () => Promise<number>;

    /**
     * Set the local volume for the Web Playback SDK.
     *
     * @example
     * player.setVolume(0.5).then(() => {
     *   console.log('Volume updated!');
     * });
     * */
    setVolume: (volume: number) => Promise<void>;

    /**
     * Pause the local playback.
     *
     * @example
     * player.pause().then(() => {
     *   console.log('Paused!');
     * });
     * */
    pause: () => Promise<void>;

    /**
     * Resume the local playback.
     *
     * @example
     * player.resume().then(() => {
     *   console.log('Resumed!');
     * });
     * */
    resume: () => Promise<void>;

    /**
     * Resume/pause the local playback.
     *
     * @example
     * player.togglePlay().then(() => {
     *   console.log('Toggled playback!');
     * });
     * */
    togglePlay: () => Promise<void>;

    /**
     * Seek to a position in the current track in local playback.
     *
     * @example
     * // Seek to a minute into the track
     * player.seek(60 * 1000).then(() => {
     *   console.log('Changed position!');
     * });
     * */
    seek: (positionMs: number) => Promise<void>;

    /**
     * Switch to the previous track in local playback.
     *
     * @example
     * player.previousTrack().then(() => {
     *   console.log('Set to previous track!');
     * });
     * */
    previousTrack: () => Promise<void>;

    /**
     * Skip to the next track in local playback.
     *
     * @example
     * player.nextTrack().then(() => {
     *   console.log('Skipped to next track!');
     * });
     * */
    nextTrack: () => Promise<void>;

    /**
     * Some browsers prevent autoplay of media by ensuring that all playback is triggered by synchronous event-paths originating from user interaction such as a click. This event allows you to manually activate the element if action is deferred or done in a separate execution context than the user action.
     *
     * @example
     * button.addEventListener('click', () => {
     *   // The application will have to explicitly call `player.activateElement()`,
     *   // since the call to Spotify Web API will be deferred.
     *   player.activateElement();
     *   setTimeout(() => {
     *     // Play track via Spotify Web API...
     *   }, 10000);
     * });
     * */
    activateElement: () => Promise<void>;
    // activateElement: () => void;
    // disconnect: () => void
    // getCurrentState: () => void
    // getVolume: () => void
    // nextTrack: (argument: any) => void
    // on: ƒ (e,t)
    // pause: () => void
    // previousTrack: (argument: any) => void
    // removeListener: ƒ (e,t)
    // resume: () => void
    // seek: (argument: any) => void
    // setName: (argument: any) => void
    // setVolume: (argument: any) => void
    // togglePlay: () => void
    // _getListeners: (argument: any) => void
    // _handleMessages: ƒ (e,t,r)
    // _onConnected: (argument: any) => void
    // _onCurrentState: (argument: any) => void
    // _onEvent: (argument: any) => void
    // _onGetToken: ƒ (e,t)
    // _onVolume: (argument: any) => void
    // _sendMessage: (argument: any) => void
    // _sendMessageWhenLoaded: (argument: any) => void
    // constructor: ƒ t(t)
  }

  interface Spotify {
    Player: Player;
  }
}

declare interface Window {
  Spotify: SpotifyWebPlayback.Spotify;
  onSpotifyWebPlaybackSDKReady: () => void;
  setPlayer: (player: Player) => void;
}
