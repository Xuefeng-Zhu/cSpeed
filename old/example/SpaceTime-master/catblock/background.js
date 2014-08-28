// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Simple extension to replace lolcat images from
// http://icanhascheezburger.com/ with loldog images instead.
chrome.webRequest.onCompleted.addListener(function(details){
  alert(details.requestHeaders);
},
{
    urls: [
      "https://i.chzbgr.com/*"
    ],
    types: ["image"]
}
)

