import { Application } from "@hotwired/stimulus"
import { definitionsFromContext } from "@hotwired/stimulus-webpack-helpers"
import "@hotwired/turbo"

window.Stimulus = Application.start();
const context = require.context("./", true, /\.js$/);
Stimulus.load(definitionsFromContext(context));

