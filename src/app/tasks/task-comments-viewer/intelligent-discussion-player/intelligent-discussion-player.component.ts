import { Component, Inject, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { timer, Subscription, BehaviorSubject } from 'rxjs';
import { IntelligentDiscussionPlayerService } from './intelligent-discussion-player.service';
import * as moment from 'moment';
import { MicrophoneTesterComponent } from 'src/app/common/audio-recorder/audio/microphone-tester/microphone-tester.component';
import { IntelligentDiscussionRecorderComponent } from './intelligent-discussion-recorder/intelligent-discussion-recorder.component';
import { AudioPlayerComponent } from 'src/app/common/audio-player/audio-player.component';
import { Task } from 'src/app/ajs-upgraded-providers';
import { ITimeUpdateEvent, NgWaveformComponent, IRegionPositions } from 'ng-waveform';

interface DiscussionComment {
  created_at: string;
  id: number;
  task_comment_id: number;
  time_completed: string;
  time_started: string;
  response: string;
  status: string;
  number_of_prompts: number;
}

@Component({
  selector: 'intelligent-discussion-player',
  templateUrl: './intelligent-discussion-player.component.html',
  styleUrls: ['./intelligent-discussion-player.component.scss'],
  providers: [IntelligentDiscussionPlayerService],
})
export class IntelligentDiscussionPlayerComponent extends AudioPlayerComponent implements AfterViewInit {
  @Input() discussion: DiscussionComment;
  @Input() task: any;
  @ViewChild('waveform', { static: false }) waveform: NgWaveformComponent;

  loading: boolean = false;
  audioProgress: number = 0;
  segments: { responseDuration: IRegionPositions; prompts: IRegionPositions[] };
  trackLoadTime: number;

  playbackSrc = { url: '' };
  waveFormisPlaying: boolean = false;

  constructor(
    @Inject(Task) TaskModel,
    public dialog: MatDialog,
    private discussionService: IntelligentDiscussionPlayerService
  ) {
    super(TaskModel);
  }

  setDurationFromAudio(audioURL: string, out: IRegionPositions, previousPosition?: IRegionPositions) {
    const tempAudioElement = new Audio(audioURL);

    tempAudioElement.addEventListener('loadeddata', () => {
      if (!previousPosition) {
        out.start = 0;
        out.end = tempAudioElement.duration;
      } else {
        out.start = previousPosition.end;
        out.end = tempAudioElement.duration;
      }
    });
  }

  ngOnInit() {
    this.loadSegmentData();
  }

  loadSegmentData() {
    this.segments = {
      responseDuration: { start: 0, end: 0 },
      prompts: new Array(this.discussion.number_of_prompts),
    };
    this.segments.prompts.fill({ start: 0, end: 0 });
    this.setDurationFromAudio(this.responseUrl, this.segments.responseDuration);

    // set prompt segments
    for (let index = 0; index < this.segments.prompts.length; index++) {
      // console.log("Setting prompt duration: " + index)
      const element = this.segments.prompts[index];
      let previousDuration = null;

      if (index > 0) {
        previousDuration = this.segments.prompts[index - 1];
      }

      const promptUrl = this.discussionService.getDiscussionPromptUrl(this.task, this.discussion.id, index);
      this.setDurationFromAudio(promptUrl, element, previousDuration);
    }
  }

  ngAfterViewInit() {
    this.setPromptTrack('response');

    this.waveform.timeUpdate.subscribe(() => {
      if (this.waveform.progress >= 100) {
        this.waveform.pause();
        this.waveFormisPlaying = false;
      }
    });
  }

  get responseAvailable() {
    return this.discussion.status === 'complete';
  }

  get isNotStudent() {
    return this.task.project().unit().my_role !== 'Student';
  }

  discussionPromptUrls(): string[] {
    return Array(this.discussion.number_of_prompts)
      .fill(null)
      .map((x, i) => this.discussionService.getDiscussionPromptUrl(this.task, this.discussion.id, i));
  }

  get responseUrl() {
    return this.discussionService.getDiscussionResponseUrl(this.task, this.discussion.id);
  }

  onPausePlayClick() {
    this.waveFormisPlaying = !this.waveFormisPlaying;
    if (this.waveFormisPlaying) {
      this.waveform.play();
    } else {
      this.waveform.pause();
    }
  }

  onTrackLoaded(time: number) {
    this.trackLoadTime = time;
    // this.waveform.play(this.firstPromptDuration);
    // this.waveform.pause();
  }

  setPlaybackRegion(track: string, promptNumber?: number) {
    if (track === 'prompt') {
      console.log(track + promptNumber);
      const region = this.segments.prompts[promptNumber];
      console.log(region);
      this.waveform.setRegionStart(region.start);
      this.waveform.setRegionEnd(region.end);
    } else {
      console.log(track + promptNumber);
      // const region = this.segments.responseDuration.getValue();
      const responseStart = this.segments.prompts[promptNumber].end;
      const nextPrompt = this.segments.prompts[promptNumber + 1];
      // tslint:disable-next-line: no-bitwise
      const responseEnd = nextPrompt?.start | this.segments.responseDuration.end;

      console.log({ start: responseStart, end: responseEnd });
      this.waveform.setRegionStart(responseStart);
      this.waveform.setRegionEnd(responseEnd);
    }
  }

  setPromptTrack(track: string, promptNumber?: number) {
    if (track === 'prompt') {
      // this.waveform.trackLoaded.unsubscribe();
      this.waveform.useRegion = false;
      // this.waveform.useRegion = false;
      // this.waveform.progress = 0;
      this.playbackSrc.url = this.discussionService.getDiscussionPromptUrl(this.task, this.discussion.id, promptNumber);
      // this.waveform.setRegionEnd();
    } else {
      this.waveform.useRegion = true;
      const sub = this.waveform.trackLoaded.subscribe(() => {
        const responseStart = this.segments.prompts[0].end;
        console.log(responseStart, this.segments.responseDuration.end);
        this.waveform.setRegionStart(responseStart);
        this.waveform.setRegionEnd(this.segments.responseDuration.end);
        sub.unsubscribe();
      });
      // this.waveform.useRegion = true;
      this.playbackSrc.url = this.responseUrl;
    }
  }

  beginDiscussion(): void {
    let dialogRef: MatDialogRef<IntelligentDiscussionDialog, any>;

    dialogRef = this.dialog.open(IntelligentDiscussionDialog, {
      data: {
        dc: this.discussion,
        task: this.task,
        audioRef: this.audio,
      },
      maxWidth: '800px',
      disableClose: true,
    });

    dialogRef.afterOpened().subscribe((result: any) => {});

    dialogRef.afterClosed().subscribe((result: any) => {});
  }
}

// The Dialog Component
// tslint:disable-next-line: max-classes-per-file
@Component({
  selector: 'intelligent-discussion-dialog',
  templateUrl: 'intelligent-discussion-dialog.html',
  styleUrls: ['./intelligent-discussion-player.component.scss'],
  providers: [IntelligentDiscussionPlayerService],
})
export class IntelligentDiscussionDialog implements OnInit {
  confirmed = false;
  timerText: string = '15m:00s';
  ticks: number = 0;
  startedDiscussion = false;
  inDiscussion = false;
  discussionComplete: boolean = false;
  count: number = 3 * 60 * 1000; // 3 minutes
  activePromptId: number = 0;
  counter: Subscription;
  guide = { text: 'Click start to begin' };

  @ViewChild('testRecorder', { static: true }) testRecorder: MicrophoneTesterComponent;
  @ViewChild('discussionRecorder', { static: true }) discussionRecorder: IntelligentDiscussionRecorderComponent;

  constructor(
    public dialogRef: MatDialogRef<IntelligentDiscussionDialog>,
    private discussionService: IntelligentDiscussionPlayerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  disableTester() {
    this.testRecorder.stopRecording();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get numberOfPrompts(): number {
    return this.data.dc.number_of_prompts;
  }

  finishDiscussion() {
    this.discussionComplete = true;
    this.inDiscussion = false;
    this.guide = { text: '' };
    this.discussionRecorder.stopRecording();
    this.data.audioRef.pause();
    this.data.audioRef.currentTime = 0;
    this.counter.unsubscribe();
    this.data.dc.status = 'complete';
  }

  startDiscussion() {
    if (!this.startedDiscussion) {
      this.setPrompt();

      // start recording
      this.discussionRecorder.startRecording();

      // start the discussion
      this.startedDiscussion = true;
      this.inDiscussion = true;

      // get the cutoff date from the server
      // For now this is stubbed as 15 minutes from now.
      const discussionCutoff = moment().add(15, 'minutes');

      this.counter = timer(0, 1000).subscribe((val) => {
        let difference = discussionCutoff.diff(moment());
        if (difference <= 0) {
          difference = 0;
        }
        this.timerText = moment.utc(difference).format('mm[m]:ss[s]');
        this.ticks = val;

        if (difference === 0) {
          this.inDiscussion = false;
          this.counter.unsubscribe();
        }
      });
    }
  }

  setPrompt() {
    this.data.audioRef.src = this.discussionService.getDiscussionPromptUrl(
      this.data.task,
      this.data.dc.id,
      this.activePromptId
    );
    this.guide.text = 'Listening to prompt';
    this.data.audioRef.load();
    this.data.audioRef.play();
    const _this = this;
    this.data.audioRef.addEventListener('ended', () => {
      setTimeout(() => {
        const audio = new Audio();
        audio.src = '/assets/sounds/discussion-start-signal.wav';
        audio.load();
        audio.play();
        _this.guide.text = 'Start responding';
      }, 400);
    });
  }

  responseConfirmed(e: any) {
    if (this.activePromptId !== this.numberOfPrompts - 1) {
      this.activePromptId++;
      this.setPrompt();
    } else {
      this.finishDiscussion();
    }
  }
}
