import { BaseModel, BaseView } from "./base";

export class ImageModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: ImageModel.model_name,
      _view_name: ImageModel.view_name,

      value: String,
      format: "jpg",
      width: Number,
      height: Number,
    };
  }

  static model_name = "ImageModel";
  static view_name = "ImageView";
}

export class ImageView extends BaseView {
  remove() {
    if (this.src) {
      URL.revokeObjectURL(this.src);
    }
    super.remove();
  }

  render() {
    this.plotAfterInterval();

    this.model.on("change:value", () => this.plotAfterInterval(), this);
    this.model.on("change:width", () => this.plotAfterInterval(), this);
    this.model.on("change:height", () => this.plotAfterInterval(), this);
    window.addEventListener("resize", () => this.plotAfterInterval());
  }

  plot() {
    this.el.innerHTML = "";
    let value = this.model.get("value");
    let format = this.model.get("format");
    let modelWidth = this.model.get("width");
    let modelHeight = this.model.get("height");

    this.setSizes();
    if (modelWidth) this.width = modelWidth;
    if (modelHeight) this.height = modelHeight;

    const node = document.createElement("div");
    const image = document.createElement("img");

    const type = `image/${format}`;
    const blob = new Blob([value], {
      type: type,
    });
    const url = URL.createObjectURL(blob);

    const oldurl = this.src;
    this.src = url;
    if (oldurl) {
      URL.revokeObjectURL(oldurl);
    }

    image.setAttribute("src", this.src);
    image.setAttribute("type", type);
    image.style.maxWidth = "100%";
    image.style.maxHeight = "100%";
    image.style.margin = "auto";
    image.style.display = "block";

    node.style.width = this.width + "px";
    node.style.height = this.height + "px";
    node.appendChild(image);

    this.getElement().appendChild(node);
  }
}

export class VideoModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: VideoModel.model_name,
      _view_name: VideoModel.view_name,

      value: new DataView(new ArrayBuffer()),
      format: "mp4",
      width: Number,
      height: Number,
      controls: true,
      _play: Boolean,
      _pause: Boolean,
      _duration: Number,
    };
  }

  static serializers = {
    ...BaseModel.serializers,
    value: {
      serialize: (value) => {
        return new DataView(value.buffer.slice(0));
      },
    },
  };

  static model_name = "VideoModel";
  static view_name = "VideoView";
}

export class VideoView extends BaseView {
  remove() {
    if (this.src) {
      URL.revokeObjectURL(this.src);
    }
    super.remove();
  }

  play() {
    if (!this.video) return;
    this.video.play();
  }

  pause() {
    if (!this.video) return;
    this.video.pause();
  }

  setControls() {
    if (!this.video) return;
    let controls = this.model.get("controls");
    if (controls) this.video.setAttribute("controls", "");
    else this.video.removeAttribute("controls");
  }

  render() {
    this.plotAfterInterval();

    this.model.on("change:value", () => this.plotAfterInterval(), this);
    this.model.on("change:width", () => this.plotAfterInterval(), this);
    this.model.on("change:height", () => this.plotAfterInterval(), this);
    this.model.on("change:controls", () => this.setControls(), this);
    this.model.on("change:_play", () => this.play(), this);
    this.model.on("change:_pause", () => this.pause(), this);
    window.addEventListener("resize", () => this.plotAfterInterval());
  }

  plot() {
    this.el.innerHTML = "";
    let value = this.model.get("value");
    let format = this.model.get("format");
    let modelWidth = this.model.get("width");
    let modelHeight = this.model.get("height");
    let controls = this.model.get("controls");

    this.setSizes();

    if (modelWidth) this.width = modelWidth;
    if (modelHeight) this.height = modelHeight;

    this.video = document.createElement("video");
    const source = document.createElement("source");

    const type = `video/${format}`;
    const blob = new Blob([value], {
      type: type,
    });
    const url = URL.createObjectURL(blob);

    const oldurl = this.src;
    this.src = url;
    if (oldurl) {
      URL.revokeObjectURL(oldurl);
    }

    source.setAttribute("src", this.src);
    source.setAttribute("type", type);

    this.video.appendChild(source);
    if (controls) this.video.setAttribute("controls", "");
    this.video.style.margin = "auto";
    this.video.style.display = "block";

    this.video.style.width = this.width + "px";
    this.video.style.height = this.height + "px";

    this.getElement().appendChild(this.video);
    setTimeout(() => {
      this.model.set({ _duration: this.video.duration });
      this.model.save_changes();
    }, 50);
  }
}