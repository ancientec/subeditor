(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/fast-diff/diff.js
  var require_diff = __commonJS({
    "node_modules/fast-diff/diff.js"(exports, module) {
      var DIFF_DELETE = -1;
      var DIFF_INSERT = 1;
      var DIFF_EQUAL = 0;
      function diff_main(text1, text2, cursor_pos, _fix_unicode) {
        if (text1 === text2) {
          if (text1) {
            return [[DIFF_EQUAL, text1]];
          }
          return [];
        }
        if (cursor_pos != null) {
          var editdiff = find_cursor_edit_diff(text1, text2, cursor_pos);
          if (editdiff) {
            return editdiff;
          }
        }
        var commonlength = diff_commonPrefix(text1, text2);
        var commonprefix = text1.substring(0, commonlength);
        text1 = text1.substring(commonlength);
        text2 = text2.substring(commonlength);
        commonlength = diff_commonSuffix(text1, text2);
        var commonsuffix = text1.substring(text1.length - commonlength);
        text1 = text1.substring(0, text1.length - commonlength);
        text2 = text2.substring(0, text2.length - commonlength);
        var diffs = diff_compute_(text1, text2);
        if (commonprefix) {
          diffs.unshift([DIFF_EQUAL, commonprefix]);
        }
        if (commonsuffix) {
          diffs.push([DIFF_EQUAL, commonsuffix]);
        }
        diff_cleanupMerge(diffs, _fix_unicode);
        return diffs;
      }
      function diff_compute_(text1, text2) {
        var diffs;
        if (!text1) {
          return [[DIFF_INSERT, text2]];
        }
        if (!text2) {
          return [[DIFF_DELETE, text1]];
        }
        var longtext = text1.length > text2.length ? text1 : text2;
        var shorttext = text1.length > text2.length ? text2 : text1;
        var i = longtext.indexOf(shorttext);
        if (i !== -1) {
          diffs = [
            [DIFF_INSERT, longtext.substring(0, i)],
            [DIFF_EQUAL, shorttext],
            [DIFF_INSERT, longtext.substring(i + shorttext.length)]
          ];
          if (text1.length > text2.length) {
            diffs[0][0] = diffs[2][0] = DIFF_DELETE;
          }
          return diffs;
        }
        if (shorttext.length === 1) {
          return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
        }
        var hm = diff_halfMatch_(text1, text2);
        if (hm) {
          var text1_a = hm[0];
          var text1_b = hm[1];
          var text2_a = hm[2];
          var text2_b = hm[3];
          var mid_common = hm[4];
          var diffs_a = diff_main(text1_a, text2_a);
          var diffs_b = diff_main(text1_b, text2_b);
          return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
        }
        return diff_bisect_(text1, text2);
      }
      function diff_bisect_(text1, text2) {
        var text1_length = text1.length;
        var text2_length = text2.length;
        var max_d = Math.ceil((text1_length + text2_length) / 2);
        var v_offset = max_d;
        var v_length = 2 * max_d;
        var v1 = new Array(v_length);
        var v2 = new Array(v_length);
        for (var x = 0; x < v_length; x++) {
          v1[x] = -1;
          v2[x] = -1;
        }
        v1[v_offset + 1] = 0;
        v2[v_offset + 1] = 0;
        var delta = text1_length - text2_length;
        var front = delta % 2 !== 0;
        var k1start = 0;
        var k1end = 0;
        var k2start = 0;
        var k2end = 0;
        for (var d = 0; d < max_d; d++) {
          for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
            var k1_offset = v_offset + k1;
            var x1;
            if (k1 === -d || k1 !== d && v1[k1_offset - 1] < v1[k1_offset + 1]) {
              x1 = v1[k1_offset + 1];
            } else {
              x1 = v1[k1_offset - 1] + 1;
            }
            var y1 = x1 - k1;
            while (x1 < text1_length && y1 < text2_length && text1.charAt(x1) === text2.charAt(y1)) {
              x1++;
              y1++;
            }
            v1[k1_offset] = x1;
            if (x1 > text1_length) {
              k1end += 2;
            } else if (y1 > text2_length) {
              k1start += 2;
            } else if (front) {
              var k2_offset = v_offset + delta - k1;
              if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] !== -1) {
                var x2 = text1_length - v2[k2_offset];
                if (x1 >= x2) {
                  return diff_bisectSplit_(text1, text2, x1, y1);
                }
              }
            }
          }
          for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
            var k2_offset = v_offset + k2;
            var x2;
            if (k2 === -d || k2 !== d && v2[k2_offset - 1] < v2[k2_offset + 1]) {
              x2 = v2[k2_offset + 1];
            } else {
              x2 = v2[k2_offset - 1] + 1;
            }
            var y2 = x2 - k2;
            while (x2 < text1_length && y2 < text2_length && text1.charAt(text1_length - x2 - 1) === text2.charAt(text2_length - y2 - 1)) {
              x2++;
              y2++;
            }
            v2[k2_offset] = x2;
            if (x2 > text1_length) {
              k2end += 2;
            } else if (y2 > text2_length) {
              k2start += 2;
            } else if (!front) {
              var k1_offset = v_offset + delta - k2;
              if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] !== -1) {
                var x1 = v1[k1_offset];
                var y1 = v_offset + x1 - k1_offset;
                x2 = text1_length - x2;
                if (x1 >= x2) {
                  return diff_bisectSplit_(text1, text2, x1, y1);
                }
              }
            }
          }
        }
        return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
      }
      function diff_bisectSplit_(text1, text2, x, y) {
        var text1a = text1.substring(0, x);
        var text2a = text2.substring(0, y);
        var text1b = text1.substring(x);
        var text2b = text2.substring(y);
        var diffs = diff_main(text1a, text2a);
        var diffsb = diff_main(text1b, text2b);
        return diffs.concat(diffsb);
      }
      function diff_commonPrefix(text1, text2) {
        if (!text1 || !text2 || text1.charAt(0) !== text2.charAt(0)) {
          return 0;
        }
        var pointermin = 0;
        var pointermax = Math.min(text1.length, text2.length);
        var pointermid = pointermax;
        var pointerstart = 0;
        while (pointermin < pointermid) {
          if (text1.substring(pointerstart, pointermid) == text2.substring(pointerstart, pointermid)) {
            pointermin = pointermid;
            pointerstart = pointermin;
          } else {
            pointermax = pointermid;
          }
          pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
        }
        if (is_surrogate_pair_start(text1.charCodeAt(pointermid - 1))) {
          pointermid--;
        }
        return pointermid;
      }
      function diff_commonSuffix(text1, text2) {
        if (!text1 || !text2 || text1.slice(-1) !== text2.slice(-1)) {
          return 0;
        }
        var pointermin = 0;
        var pointermax = Math.min(text1.length, text2.length);
        var pointermid = pointermax;
        var pointerend = 0;
        while (pointermin < pointermid) {
          if (text1.substring(text1.length - pointermid, text1.length - pointerend) == text2.substring(text2.length - pointermid, text2.length - pointerend)) {
            pointermin = pointermid;
            pointerend = pointermin;
          } else {
            pointermax = pointermid;
          }
          pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
        }
        if (is_surrogate_pair_end(text1.charCodeAt(text1.length - pointermid))) {
          pointermid--;
        }
        return pointermid;
      }
      function diff_halfMatch_(text1, text2) {
        var longtext = text1.length > text2.length ? text1 : text2;
        var shorttext = text1.length > text2.length ? text2 : text1;
        if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
          return null;
        }
        function diff_halfMatchI_(longtext2, shorttext2, i) {
          var seed = longtext2.substring(i, i + Math.floor(longtext2.length / 4));
          var j = -1;
          var best_common = "";
          var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
          while ((j = shorttext2.indexOf(seed, j + 1)) !== -1) {
            var prefixLength = diff_commonPrefix(longtext2.substring(i), shorttext2.substring(j));
            var suffixLength = diff_commonSuffix(longtext2.substring(0, i), shorttext2.substring(0, j));
            if (best_common.length < suffixLength + prefixLength) {
              best_common = shorttext2.substring(j - suffixLength, j) + shorttext2.substring(j, j + prefixLength);
              best_longtext_a = longtext2.substring(0, i - suffixLength);
              best_longtext_b = longtext2.substring(i + prefixLength);
              best_shorttext_a = shorttext2.substring(0, j - suffixLength);
              best_shorttext_b = shorttext2.substring(j + prefixLength);
            }
          }
          if (best_common.length * 2 >= longtext2.length) {
            return [
              best_longtext_a,
              best_longtext_b,
              best_shorttext_a,
              best_shorttext_b,
              best_common
            ];
          } else {
            return null;
          }
        }
        var hm1 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 4));
        var hm2 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 2));
        var hm;
        if (!hm1 && !hm2) {
          return null;
        } else if (!hm2) {
          hm = hm1;
        } else if (!hm1) {
          hm = hm2;
        } else {
          hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
        }
        var text1_a, text1_b, text2_a, text2_b;
        if (text1.length > text2.length) {
          text1_a = hm[0];
          text1_b = hm[1];
          text2_a = hm[2];
          text2_b = hm[3];
        } else {
          text2_a = hm[0];
          text2_b = hm[1];
          text1_a = hm[2];
          text1_b = hm[3];
        }
        var mid_common = hm[4];
        return [text1_a, text1_b, text2_a, text2_b, mid_common];
      }
      function diff_cleanupMerge(diffs, fix_unicode) {
        diffs.push([DIFF_EQUAL, ""]);
        var pointer = 0;
        var count_delete = 0;
        var count_insert = 0;
        var text_delete = "";
        var text_insert = "";
        var commonlength;
        while (pointer < diffs.length) {
          if (pointer < diffs.length - 1 && !diffs[pointer][1]) {
            diffs.splice(pointer, 1);
            continue;
          }
          switch (diffs[pointer][0]) {
            case DIFF_INSERT:
              count_insert++;
              text_insert += diffs[pointer][1];
              pointer++;
              break;
            case DIFF_DELETE:
              count_delete++;
              text_delete += diffs[pointer][1];
              pointer++;
              break;
            case DIFF_EQUAL:
              var previous_equality = pointer - count_insert - count_delete - 1;
              if (fix_unicode) {
                if (previous_equality >= 0 && ends_with_pair_start(diffs[previous_equality][1])) {
                  var stray = diffs[previous_equality][1].slice(-1);
                  diffs[previous_equality][1] = diffs[previous_equality][1].slice(0, -1);
                  text_delete = stray + text_delete;
                  text_insert = stray + text_insert;
                  if (!diffs[previous_equality][1]) {
                    diffs.splice(previous_equality, 1);
                    pointer--;
                    var k = previous_equality - 1;
                    if (diffs[k] && diffs[k][0] === DIFF_INSERT) {
                      count_insert++;
                      text_insert = diffs[k][1] + text_insert;
                      k--;
                    }
                    if (diffs[k] && diffs[k][0] === DIFF_DELETE) {
                      count_delete++;
                      text_delete = diffs[k][1] + text_delete;
                      k--;
                    }
                    previous_equality = k;
                  }
                }
                if (starts_with_pair_end(diffs[pointer][1])) {
                  var stray = diffs[pointer][1].charAt(0);
                  diffs[pointer][1] = diffs[pointer][1].slice(1);
                  text_delete += stray;
                  text_insert += stray;
                }
              }
              if (pointer < diffs.length - 1 && !diffs[pointer][1]) {
                diffs.splice(pointer, 1);
                break;
              }
              if (text_delete.length > 0 || text_insert.length > 0) {
                if (text_delete.length > 0 && text_insert.length > 0) {
                  commonlength = diff_commonPrefix(text_insert, text_delete);
                  if (commonlength !== 0) {
                    if (previous_equality >= 0) {
                      diffs[previous_equality][1] += text_insert.substring(0, commonlength);
                    } else {
                      diffs.splice(0, 0, [DIFF_EQUAL, text_insert.substring(0, commonlength)]);
                      pointer++;
                    }
                    text_insert = text_insert.substring(commonlength);
                    text_delete = text_delete.substring(commonlength);
                  }
                  commonlength = diff_commonSuffix(text_insert, text_delete);
                  if (commonlength !== 0) {
                    diffs[pointer][1] = text_insert.substring(text_insert.length - commonlength) + diffs[pointer][1];
                    text_insert = text_insert.substring(0, text_insert.length - commonlength);
                    text_delete = text_delete.substring(0, text_delete.length - commonlength);
                  }
                }
                var n = count_insert + count_delete;
                if (text_delete.length === 0 && text_insert.length === 0) {
                  diffs.splice(pointer - n, n);
                  pointer = pointer - n;
                } else if (text_delete.length === 0) {
                  diffs.splice(pointer - n, n, [DIFF_INSERT, text_insert]);
                  pointer = pointer - n + 1;
                } else if (text_insert.length === 0) {
                  diffs.splice(pointer - n, n, [DIFF_DELETE, text_delete]);
                  pointer = pointer - n + 1;
                } else {
                  diffs.splice(pointer - n, n, [DIFF_DELETE, text_delete], [DIFF_INSERT, text_insert]);
                  pointer = pointer - n + 2;
                }
              }
              if (pointer !== 0 && diffs[pointer - 1][0] === DIFF_EQUAL) {
                diffs[pointer - 1][1] += diffs[pointer][1];
                diffs.splice(pointer, 1);
              } else {
                pointer++;
              }
              count_insert = 0;
              count_delete = 0;
              text_delete = "";
              text_insert = "";
              break;
          }
        }
        if (diffs[diffs.length - 1][1] === "") {
          diffs.pop();
        }
        var changes = false;
        pointer = 1;
        while (pointer < diffs.length - 1) {
          if (diffs[pointer - 1][0] === DIFF_EQUAL && diffs[pointer + 1][0] === DIFF_EQUAL) {
            if (diffs[pointer][1].substring(diffs[pointer][1].length - diffs[pointer - 1][1].length) === diffs[pointer - 1][1]) {
              diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(0, diffs[pointer][1].length - diffs[pointer - 1][1].length);
              diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
              diffs.splice(pointer - 1, 1);
              changes = true;
            } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) == diffs[pointer + 1][1]) {
              diffs[pointer - 1][1] += diffs[pointer + 1][1];
              diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
              diffs.splice(pointer + 1, 1);
              changes = true;
            }
          }
          pointer++;
        }
        if (changes) {
          diff_cleanupMerge(diffs, fix_unicode);
        }
      }
      function is_surrogate_pair_start(charCode) {
        return charCode >= 55296 && charCode <= 56319;
      }
      function is_surrogate_pair_end(charCode) {
        return charCode >= 56320 && charCode <= 57343;
      }
      function starts_with_pair_end(str) {
        return is_surrogate_pair_end(str.charCodeAt(0));
      }
      function ends_with_pair_start(str) {
        return is_surrogate_pair_start(str.charCodeAt(str.length - 1));
      }
      function remove_empty_tuples(tuples) {
        var ret = [];
        for (var i = 0; i < tuples.length; i++) {
          if (tuples[i][1].length > 0) {
            ret.push(tuples[i]);
          }
        }
        return ret;
      }
      function make_edit_splice(before, oldMiddle, newMiddle, after) {
        if (ends_with_pair_start(before) || starts_with_pair_end(after)) {
          return null;
        }
        return remove_empty_tuples([
          [DIFF_EQUAL, before],
          [DIFF_DELETE, oldMiddle],
          [DIFF_INSERT, newMiddle],
          [DIFF_EQUAL, after]
        ]);
      }
      function find_cursor_edit_diff(oldText, newText, cursor_pos) {
        var oldRange = typeof cursor_pos === "number" ? { index: cursor_pos, length: 0 } : cursor_pos.oldRange;
        var newRange = typeof cursor_pos === "number" ? null : cursor_pos.newRange;
        var oldLength = oldText.length;
        var newLength = newText.length;
        if (oldRange.length === 0 && (newRange === null || newRange.length === 0)) {
          var oldCursor = oldRange.index;
          var oldBefore = oldText.slice(0, oldCursor);
          var oldAfter = oldText.slice(oldCursor);
          var maybeNewCursor = newRange ? newRange.index : null;
          editBefore: {
            var newCursor = oldCursor + newLength - oldLength;
            if (maybeNewCursor !== null && maybeNewCursor !== newCursor) {
              break editBefore;
            }
            if (newCursor < 0 || newCursor > newLength) {
              break editBefore;
            }
            var newBefore = newText.slice(0, newCursor);
            var newAfter = newText.slice(newCursor);
            if (newAfter !== oldAfter) {
              break editBefore;
            }
            var prefixLength = Math.min(oldCursor, newCursor);
            var oldPrefix = oldBefore.slice(0, prefixLength);
            var newPrefix = newBefore.slice(0, prefixLength);
            if (oldPrefix !== newPrefix) {
              break editBefore;
            }
            var oldMiddle = oldBefore.slice(prefixLength);
            var newMiddle = newBefore.slice(prefixLength);
            return make_edit_splice(oldPrefix, oldMiddle, newMiddle, oldAfter);
          }
          editAfter: {
            if (maybeNewCursor !== null && maybeNewCursor !== oldCursor) {
              break editAfter;
            }
            var cursor = oldCursor;
            var newBefore = newText.slice(0, cursor);
            var newAfter = newText.slice(cursor);
            if (newBefore !== oldBefore) {
              break editAfter;
            }
            var suffixLength = Math.min(oldLength - cursor, newLength - cursor);
            var oldSuffix = oldAfter.slice(oldAfter.length - suffixLength);
            var newSuffix = newAfter.slice(newAfter.length - suffixLength);
            if (oldSuffix !== newSuffix) {
              break editAfter;
            }
            var oldMiddle = oldAfter.slice(0, oldAfter.length - suffixLength);
            var newMiddle = newAfter.slice(0, newAfter.length - suffixLength);
            return make_edit_splice(oldBefore, oldMiddle, newMiddle, oldSuffix);
          }
        }
        if (oldRange.length > 0 && newRange && newRange.length === 0) {
          replaceRange: {
            var oldPrefix = oldText.slice(0, oldRange.index);
            var oldSuffix = oldText.slice(oldRange.index + oldRange.length);
            var prefixLength = oldPrefix.length;
            var suffixLength = oldSuffix.length;
            if (newLength < prefixLength + suffixLength) {
              break replaceRange;
            }
            var newPrefix = newText.slice(0, prefixLength);
            var newSuffix = newText.slice(newLength - suffixLength);
            if (oldPrefix !== newPrefix || oldSuffix !== newSuffix) {
              break replaceRange;
            }
            var oldMiddle = oldText.slice(prefixLength, oldLength - suffixLength);
            var newMiddle = newText.slice(prefixLength, newLength - suffixLength);
            return make_edit_splice(oldPrefix, oldMiddle, newMiddle, oldSuffix);
          }
        }
        return null;
      }
      function diff(text1, text2, cursor_pos) {
        return diff_main(text1, text2, cursor_pos, true);
      }
      diff.INSERT = DIFF_INSERT;
      diff.DELETE = DIFF_DELETE;
      diff.EQUAL = DIFF_EQUAL;
      module.exports = diff;
    }
  });

  // node_modules/textdiff-create/index.js
  var require_textdiff_create = __commonJS({
    "node_modules/textdiff-create/index.js"(exports, module) {
      "use strict";
      var diff = require_diff();
      module.exports = function(original, revision) {
        var result = diff(original, revision);
        for (var i = 0; i < result.length; i++) {
          var item = result[i];
          if (item[0] < 1) {
            item[1] = item[1].length;
          }
        }
        return result;
      };
    }
  });

  // node_modules/textdiff-patch/index.js
  var require_textdiff_patch = __commonJS({
    "node_modules/textdiff-patch/index.js"(exports, module) {
      "use strict";
      module.exports = function(original, delta) {
        var result = "", index = 0;
        for (var i = 0; i < delta.length; i++) {
          var item = delta[i], operation = item[0], value = item[1];
          if (operation == -1) {
            index += value;
          } else if (operation == 0) {
            result += original.slice(index, index += value);
          } else {
            result += value;
          }
        }
        return result;
      };
    }
  });

  // node_modules/@ancientec/selection-serializer/dist/selection_serializer.js
  var require_selection_serializer = __commonJS({
    "node_modules/@ancientec/selection-serializer/dist/selection_serializer.js"(exports) {
      "use strict";
      exports.__esModule = true;
      function nodeMapping(contentContainer, el) {
        var mapping = [];
        while (el !== contentContainer && el.parentNode) {
          mapping.push(Array.from(el.parentNode.childNodes).indexOf(el));
          el = el.parentNode;
        }
        return mapping;
      }
      function saveSlim(contentContainer) {
        return saveSelection(contentContainer, true);
      }
      function saveSelection(contentContainer, returnSlim) {
        if (returnSlim === void 0) {
          returnSlim = false;
        }
        var selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
          return !returnSlim ? {
            startContainer: [],
            startOffset: 0,
            endContainer: [],
            endOffset: 0,
            direction: "none"
          } : {
            s: [],
            so: 0,
            e: [],
            eo: 0,
            d: "n"
          };
        }
        var range = selection.getRangeAt(0);
        if (range.intersectsNode(contentContainer)) {
          if (!contentContainer.contains(range.startContainer)) {
            range.setStart(contentContainer.childNodes.length === 0 ? contentContainer : contentContainer.childNodes[0], 0);
          }
          if (!contentContainer.contains(range.endContainer)) {
            if (!contentContainer.childNodes.length) {
              range.setEnd(contentContainer, 0);
            } else {
              var n = contentContainer.childNodes[contentContainer.childNodes.length - 1];
              if (n.nodeType === 3) {
                range.setEnd(n, (n.textContent || "").length);
              } else {
                range.setEnd(n, n.childNodes.length);
              }
            }
          }
        } else if (!contentContainer.contains(range.startContainer) || !contentContainer.contains(range.endContainer)) {
          range.setStart(contentContainer.childNodes.length === 0 ? contentContainer : contentContainer.childNodes[0], 0);
          if (!contentContainer.childNodes.length) {
            range.setEnd(contentContainer, 0);
          } else {
            var n = contentContainer.childNodes[contentContainer.childNodes.length - 1];
            if (n.nodeType === 3) {
              range.setEnd(n, (n.textContent || "").length);
            } else {
              range.setEnd(n, n.childNodes.length);
            }
          }
          range.collapse(false);
        }
        var startContainer = nodeMapping(contentContainer, range.startContainer), startOffset = range.startOffset, endContainer = range.startContainer === range.endContainer ? startContainer : nodeMapping(contentContainer, range.endContainer), endOffset = range.endOffset;
        var direction = "none";
        if (!selection.isCollapsed && selection.anchorNode !== selection.focusNode && selection.anchorNode && selection.focusNode) {
          if (selection.anchorNode.compareDocumentPosition(selection.focusNode) & Node.DOCUMENT_POSITION_FOLLOWING) {
            direction = "forward";
          } else if (selection.anchorNode.compareDocumentPosition(selection.focusNode) & Node.DOCUMENT_POSITION_PRECEDING) {
            direction = "backward";
          }
        }
        return !returnSlim ? {
          startContainer,
          startOffset,
          endContainer,
          endOffset,
          direction
        } : {
          s: startContainer,
          so: startOffset,
          e: endContainer,
          eo: endOffset,
          d: direction.substring(0, 1)
        };
      }
      function restoreSelection(contentContainer, select) {
        var selection = window.getSelection();
        selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
        var sel = select.hasOwnProperty("direction") ? select : {
          startContainer: select.s,
          startOffset: select.so,
          endContainer: select.e,
          endOffset: select.eo,
          direction: select.d
        };
        var startContainer = contentContainer;
        for (var i = sel.startContainer.length - 1; i >= 0; i--) {
          if (startContainer.childNodes && startContainer.childNodes.length > sel.startContainer[i] && startContainer.childNodes[sel.startContainer[i]]) {
            startContainer = startContainer.childNodes[sel.startContainer[i]];
          }
        }
        if (startContainer.nodeType === Node.TEXT_NODE && startContainer.textContent.length < sel.startOffset) {
          sel.startOffset = startContainer.textContent.length;
        } else if (startContainer.childNodes.length >= 1 && startContainer.childNodes.length < sel.startOffset) {
          sel.startOffset = startContainer.childNodes.length - 1;
        }
        var endContainer = contentContainer;
        for (var i = sel.endContainer.length - 1; i >= 0; i--) {
          if (endContainer.childNodes && endContainer.childNodes.length > sel.endContainer[i] && endContainer.childNodes[sel.endContainer[i]]) {
            endContainer = endContainer.childNodes[sel.endContainer[i]];
          }
        }
        if (endContainer.nodeType === Node.TEXT_NODE && endContainer.textContent.length < sel.endOffset) {
          sel.endOffset = endContainer.textContent.length;
        } else if (endContainer.childNodes.length >= 1 && endContainer.childNodes.length < sel.endOffset) {
          sel.endOffset = endContainer.childNodes.length - 1;
        }
        var newRange = document.createRange();
        if (sel.direction === "backward" || sel.direction === "b") {
          newRange.setStart(endContainer, sel.endOffset);
          newRange.setEnd(endContainer, sel.endOffset);
          selection === null || selection === void 0 ? void 0 : selection.addRange(newRange);
          selection === null || selection === void 0 ? void 0 : selection.extend(startContainer, sel.startOffset);
          newRange = selection === null || selection === void 0 ? void 0 : selection.getRangeAt(0);
        } else {
          newRange.setStart(startContainer, sel.startOffset);
          newRange.setEnd(endContainer, sel.endOffset);
          selection === null || selection === void 0 ? void 0 : selection.addRange(newRange);
        }
      }
      if (typeof window !== "undefined") {
        window.SelectionSerializer = {
          save: saveSelection,
          saveSlim,
          restore: restoreSelection
        };
      }
      exports["default"] = {
        save: saveSelection,
        saveSlim,
        restore: restoreSelection
      };
    }
  });

  // node_modules/is-hotkey/lib/index.js
  var require_lib = __commonJS({
    "node_modules/is-hotkey/lib/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var IS_MAC = typeof window != "undefined" && /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
      var MODIFIERS = {
        alt: "altKey",
        control: "ctrlKey",
        meta: "metaKey",
        shift: "shiftKey"
      };
      var ALIASES = {
        add: "+",
        break: "pause",
        cmd: "meta",
        command: "meta",
        ctl: "control",
        ctrl: "control",
        del: "delete",
        down: "arrowdown",
        esc: "escape",
        ins: "insert",
        left: "arrowleft",
        mod: IS_MAC ? "meta" : "control",
        opt: "alt",
        option: "alt",
        return: "enter",
        right: "arrowright",
        space: " ",
        spacebar: " ",
        up: "arrowup",
        win: "meta",
        windows: "meta"
      };
      var CODES = {
        backspace: 8,
        tab: 9,
        enter: 13,
        shift: 16,
        control: 17,
        alt: 18,
        pause: 19,
        capslock: 20,
        escape: 27,
        " ": 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36,
        arrowleft: 37,
        arrowup: 38,
        arrowright: 39,
        arrowdown: 40,
        insert: 45,
        delete: 46,
        meta: 91,
        numlock: 144,
        scrolllock: 145,
        ";": 186,
        "=": 187,
        ",": 188,
        "-": 189,
        ".": 190,
        "/": 191,
        "`": 192,
        "[": 219,
        "\\": 220,
        "]": 221,
        "'": 222
      };
      for (f = 1; f < 20; f++) {
        CODES["f" + f] = 111 + f;
      }
      var f;
      function isHotkey2(hotkey, options, event) {
        if (options && !("byKey" in options)) {
          event = options;
          options = null;
        }
        if (!Array.isArray(hotkey)) {
          hotkey = [hotkey];
        }
        var array = hotkey.map(function(string) {
          return parseHotkey(string, options);
        });
        var check = function check2(e) {
          return array.some(function(object) {
            return compareHotkey(object, e);
          });
        };
        var ret = event == null ? check : check(event);
        return ret;
      }
      function isCodeHotkey(hotkey, event) {
        return isHotkey2(hotkey, event);
      }
      function isKeyHotkey(hotkey, event) {
        return isHotkey2(hotkey, { byKey: true }, event);
      }
      function parseHotkey(hotkey, options) {
        var byKey = options && options.byKey;
        var ret = {};
        hotkey = hotkey.replace("++", "+add");
        var values = hotkey.split("+");
        var length = values.length;
        for (var k in MODIFIERS) {
          ret[MODIFIERS[k]] = false;
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = void 0;
        try {
          for (var _iterator = values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var value = _step.value;
            var optional = value.endsWith("?") && value.length > 1;
            if (optional) {
              value = value.slice(0, -1);
            }
            var name = toKeyName(value);
            var modifier = MODIFIERS[name];
            if (value.length > 1 && !modifier && !ALIASES[value] && !CODES[name]) {
              throw new TypeError('Unknown modifier: "' + value + '"');
            }
            if (length === 1 || !modifier) {
              if (byKey) {
                ret.key = name;
              } else {
                ret.which = toKeyCode(value);
              }
            }
            if (modifier) {
              ret[modifier] = optional ? null : true;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
        return ret;
      }
      function compareHotkey(object, event) {
        for (var key in object) {
          var expected = object[key];
          var actual = void 0;
          if (expected == null) {
            continue;
          }
          if (key === "key" && event.key != null) {
            actual = event.key.toLowerCase();
          } else if (key === "which") {
            actual = expected === 91 && event.which === 93 ? 91 : event.which;
          } else {
            actual = event[key];
          }
          if (actual == null && expected === false) {
            continue;
          }
          if (actual !== expected) {
            return false;
          }
        }
        return true;
      }
      function toKeyCode(name) {
        name = toKeyName(name);
        var code = CODES[name] || name.toUpperCase().charCodeAt(0);
        return code;
      }
      function toKeyName(name) {
        name = name.toLowerCase();
        name = ALIASES[name] || name;
        return name;
      }
      exports.default = isHotkey2;
      exports.isHotkey = isHotkey2;
      exports.isCodeHotkey = isCodeHotkey;
      exports.isKeyHotkey = isKeyHotkey;
      exports.parseHotkey = parseHotkey;
      exports.compareHotkey = compareHotkey;
      exports.toKeyCode = toKeyCode;
      exports.toKeyName = toKeyName;
    }
  });

  // src/debounce.ts
  var debounce = (func, wait = 100) => {
    let timeout;
    const debounced = (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
    return debounced;
  };
  var debounce_default = debounce;

  // src/history.ts
  var import_textdiff_create = __toModule(require_textdiff_create());
  var import_textdiff_patch = __toModule(require_textdiff_patch());

  // src/diffpatch.ts
  function mapAttr(source, target) {
    let source_attributes = {};
    let i = 0, n = 0, atts;
    for (i = 0, atts = source.attributes, n = atts.length; i < n; i++) {
      let name = atts[i].nodeName || atts[i].name, v = atts[i].value;
      if (!v)
        continue;
      source_attributes[name] = v;
      if (v === target.getAttribute(name))
        continue;
      target.setAttribute(name, v);
    }
    for (i = target.attributes.length - 1, atts = target.attributes; i >= 0; i--) {
      let name = atts[i].nodeName || atts[i].name, v = atts[i].value;
      if (!v)
        continue;
      if (typeof source_attributes[name] === "undefined") {
        target.removeAttribute(name);
      }
    }
  }
  function diffPatch(source, target, skipContainerAttr = true) {
    if (source.nodeType === 3 && target.nodeType === 3) {
      if (source.textContent !== target.textContent) {
        target.textContent = source.textContent;
      }
      return;
    }
    if (source.nodeType !== target.nodeType || source.nodeName !== target.nodeName) {
      target.replaceWith(source.cloneNode(true));
      return;
    }
    if (!skipContainerAttr)
      mapAttr(source, target);
    if ((!target.childNodes || target.childNodes.length === 0) && (source.childNodes && source.childNodes.length !== 0)) {
      Array.from(source.childNodes).forEach((node) => {
        target.appendChild(node.cloneNode(true));
      });
      return;
    }
    Array.from(source.childNodes).forEach((node, idx) => {
      if (typeof target.childNodes[idx] === "undefined") {
        target.appendChild(node.cloneNode(true));
        return;
      }
      if (node.nodeType !== target.childNodes[idx].nodeType) {
        target.childNodes[idx].replaceWith(node.cloneNode(true));
      } else if (node.nodeType === 3) {
        if (target.childNodes[idx].textContent !== node.textContent) {
          target.childNodes[idx].textContent = node.textContent;
        }
        return;
      } else {
        diffPatch(node, target.childNodes[idx], false);
      }
    });
    while (target.lastChild && target.childNodes.length > source.childNodes.length) {
      target.removeChild(target.lastChild);
    }
  }

  // src/history.ts
  var import_selection_serializer = __toModule(require_selection_serializer());
  var _History = class {
    constructor(contentContainer) {
      this.entryIndex = 0;
      this.entryList = [];
      this.entryChangeList = [];
      this.lastContentStr = null;
      this.id = 0;
      this.counter = -1;
      this.id = ++_History.HistoryInstanceCounter;
      this.contentContainer = contentContainer;
      this.lastContentDom = document.createElement(contentContainer.tagName);
    }
    KeyCounter() {
      return ++this.counter;
    }
    Undo() {
      if (this.entryList.length === 0 || this.entryIndex === 0) {
        return null;
      }
      this.entryIndex = this.entryIndex - 1;
      let str = "";
      for (let i = 0; i <= this.entryIndex; i++) {
        str = (0, import_textdiff_patch.default)(str, this.entryList[i].delta);
      }
      this.lastContentStr = str;
      this.lastContentDom.innerHTML = str;
      diffPatch(this.lastContentDom, this.contentContainer);
      import_selection_serializer.default.restore(this.contentContainer, this.entryList[this.entryIndex].selection);
      return {
        key: this.KeyCounter(),
        change: this.entryList[this.entryIndex],
        content: str
      };
    }
    Redo() {
      if (this.entryIndex + 1 >= this.entryList.length) {
        return null;
      }
      this.entryIndex = this.entryIndex + 1;
      const currentEntry = this.entryList[this.entryIndex];
      let str = "";
      for (let i = 0; i <= this.entryIndex; i++) {
        str = (0, import_textdiff_patch.default)(str, this.entryList[i].delta);
      }
      this.lastContentStr = str;
      this.lastContentDom.innerHTML = str;
      diffPatch(this.lastContentDom, this.contentContainer);
      import_selection_serializer.default.restore(this.contentContainer, currentEntry.selection);
      return {
        key: this.KeyCounter(),
        change: currentEntry,
        content: this.contentContainer.innerHTML
      };
    }
    Next() {
      if (!this.contentContainer)
        return null;
      if (this.lastContentStr === this.contentContainer.innerHTML)
        return null;
      if (this.entryList.length > this.entryIndex + 1) {
        this.entryList.splice(this.entryIndex + 1, this.entryList.length - this.entryIndex - 1);
      }
      const delta = (0, import_textdiff_create.default)(this.lastContentStr || "", this.contentContainer.innerHTML || "");
      this.entryList.push({
        delta,
        selection: import_selection_serializer.default.saveSlim(this.contentContainer)
      });
      this.entryIndex = this.entryList.length - 1;
      this.lastContentStr = this.contentContainer.innerHTML;
      diffPatch(this.contentContainer, this.lastContentDom);
      return {
        key: this.KeyCounter(),
        change: this.entryList[this.entryList.length - 1],
        content: this.contentContainer.innerHTML
      };
    }
  };
  var History = _History;
  History.HistoryInstanceCounter = 0;
  var history_default = History;

  // src/event.ts
  var import_is_hotkey = __toModule(require_lib());
  var Event = class {
    constructor(editor) {
      this.events = {
        onKeyDown: [],
        onKeyUp: [],
        onClick: [],
        onCommand: [],
        onFeatureChange: [],
        onPaste: [],
        onBlur: [],
        onBeforeChange: [],
        onFullscreenChange: []
      };
      this.editor = editor;
    }
    getEvents() {
      return this.events;
    }
    trigger(event, target, args) {
      var _a;
      if (typeof this.events[event] === "undefined")
        return;
      if (!args)
        args = [];
      for (let i = 0, n = this.events[event].length; i < n; i++) {
        if (["registerUI", "registerSvg", "registerLanguage"].indexOf(event) !== -1) {
          SubEditor.presetSvg(this.events[event][i].callback(this.editor));
          continue;
        }
        if (event === "registerCss") {
          SubEditor.pluginCSS = Object.assign(SubEditor.pluginCSS, this.events[event][i].callback(this.editor));
          continue;
        }
        if (event === "registerToolbarItem") {
          (_a = this.editor.toolbar) == null ? void 0 : _a.registerPluginItem(this.events[event][i].callback(this.editor));
          continue;
        }
        if ((event === "onKeyDown" || event === "onKeyUp") && this.events[event][i].target.length > 0) {
          let isKey = false;
          this.events[event][i].target.forEach((key) => {
            if ((0, import_is_hotkey.default)(key, args[1]))
              isKey = true;
          });
          if (!isKey)
            continue;
        } else if (this.events[event][i].target && this.events[event][i].target.length > 0 && !this.events[event][i].target.includes(target)) {
          continue;
        }
        if (event !== "onFeatureChange") {
          this.editor.handleFeature();
        }
        this.events[event][i].callback.apply(this, args);
      }
    }
    register(plugin) {
      plugin.forEach((p) => {
        if (!p.callback || !p.event)
          return;
        if (typeof this.events[p.event] === "undefined") {
          this.events[p.event] = [];
        }
        if (!this.events[p.event].includes(p))
          this.events[p.event].push(p);
      });
    }
    unregister(plugin) {
      plugin.forEach((p) => {
        if (!p.callback || !p.event)
          return;
        for (let i = this.events[p.event].length - 1, t = 0; i >= t; i--) {
          if (this.events[p.event][i] === p) {
            this.events[p.event].splice(i, 1);
            break;
          }
        }
      });
    }
  };

  // src/feature.ts
  var Feature = class {
    constructor() {
      this.path = [];
      this.pathNode = [];
      this.node = void 0;
      this.nodeName = "";
      this.formatEL = "";
      this.color = "";
      this.background = "";
      this.indent = "";
      this.align = "";
      this.bold = false;
      this.italic = false;
      this.underline = false;
      this.strikethrough = false;
      this.subscript = false;
      this.superscript = false;
      this.a = {
        href: "",
        target: "",
        node: void 0
      };
      this.img = {
        src: "",
        width: "",
        height: "",
        node: void 0
      };
      this.video = void 0;
      this.audio = void 0;
    }
  };
  function nodeAttrStyle(el, tag) {
    let styles = {};
    if (!el || !el.style)
      return styles;
    const s = (el.getAttribute("style") || "").split(";");
    s.forEach((pair) => {
      if (!pair.trim())
        return;
      const idx = pair.indexOf(":");
      if (idx === -1)
        return;
      let p = [pair.substring(0, idx).trim(), (pair.substring(idx + 1) || "").trim()];
      styles[p[0]] = p[1];
      if (p[0] === "background" && p[1].indexOf("url(") === 0) {
        styles[p[0]] = el.style.background;
      }
    });
    if (tag)
      return styles[tag] || "";
    return styles;
  }
  function parseFeature(n, container) {
    let f = new Feature();
    if (!n || !container)
      return f;
    let styles = {}, style = {};
    f.node = n.nodeType === Node.TEXT_NODE ? n.parentElement : n;
    f.nodeName = f.node.nodeName;
    let el = f.node;
    while (el && el !== container) {
      f.path.push(el.nodeName);
      f.pathNode.push(el);
      let s = nodeAttrStyle(el);
      Object.keys(s).forEach((key) => {
        if (typeof styles[key] === "undefined") {
          styles[key] = s[key];
        }
      });
      el = el.parentElement;
    }
    const formats = ["P", "H1", "H2", "H3", "H4", "H5", "H6", "CODE", "PRE"];
    let formatEL = "";
    for (let i = 0; i < f.path.length; i++) {
      if (formatEL === "" && formats.indexOf(f.path[i]) !== -1) {
        formatEL = f.path[i];
        break;
      }
    }
    if (formatEL === "PRE")
      formatEL = "CODE";
    f.formatEL = formatEL;
    f.bold = f.path.indexOf("STRONG") !== -1;
    f.italic = f.path.indexOf("EM") !== -1;
    f.underline = f.path.indexOf("U") !== -1;
    f.strikethrough = f.path.indexOf("STRIKE") !== -1;
    f.subscript = f.path.indexOf("SUB") !== -1;
    f.superscript = f.path.indexOf("SUP") !== -1;
    if (f.path.indexOf("A") !== -1) {
      const node = f.pathNode[f.path.indexOf("A")];
      f.a = {
        href: node.getAttribute("href") || "",
        target: node.getAttribute("target") || "",
        node
      };
    }
    if (f.path[0] === "IMG") {
      const node = f.pathNode[0], styleimg = nodeAttrStyle(node);
      f.img = {
        src: node.getAttribute("src") || "",
        width: styleimg["width"] || "",
        height: styleimg["height"] || "",
        node
      };
    }
    if (f.path[0] === "VIDEO") {
      const node = f.pathNode[0], styleimg = nodeAttrStyle(node);
      f.video = {
        controls: node.hasAttribute("controls"),
        autoplay: node.hasAttribute("autoplay"),
        width: styleimg["width"] || "",
        height: styleimg["height"] || "",
        node,
        sources: []
      };
      node.querySelectorAll("source").forEach((source) => {
        var _a;
        (_a = f.video) == null ? void 0 : _a.sources.push({ src: source.getAttribute("src") || "", type: source.getAttribute("type") || "" });
      });
    }
    if (f.path[0] === "AUDIO") {
      const node = f.pathNode[0], styleimg = nodeAttrStyle(node);
      f.video = {
        controls: node.hasAttribute("controls"),
        autoplay: node.hasAttribute("autoplay"),
        width: styleimg["width"] || "",
        height: styleimg["height"] || "",
        node,
        sources: []
      };
      node.querySelectorAll("source").forEach((source) => {
        var _a;
        (_a = f.video) == null ? void 0 : _a.sources.push({ src: source.getAttribute("src") || "", type: source.getAttribute("type") || "" });
      });
    }
    if (f.node && f.node !== container) {
      style = nodeAttrStyle(f.node);
      f.color = style["color"] ? style["color"] : "";
      f.background = style["background-color"] ? style["background-color"] : "";
      f.indent = style["padding-left"] ? style["padding-left"] : "";
      f.align = style["text-align"] ? style["text-align"] : "";
    }
    return f;
  }
  var feature_default = parseFeature;

  // src/table.ts
  function colSpan(node) {
    return parseInt(node.getAttribute("colspan") || "1", 10);
  }
  function rowSpan(node) {
    return parseInt(node.getAttribute("rowspan") || "1", 10);
  }
  function rowCol(tr) {
    let col2 = 0;
    Array.from(tr.childNodes).forEach((td) => col2 += parseInt(td.getAttribute("colspan") || "1", 10));
    return col2;
  }
  function col(table) {
    let tableC = 0;
    Array.from(table.querySelectorAll("tr")).forEach((tr) => {
      let col2 = rowCol(tr);
      if (col2 > tableC)
        tableC = col2;
    });
    return tableC;
  }
  function cellList(table, withHeader = true, useNull = false) {
    const tableCols = col(table);
    const trs = Array.from(withHeader ? table.querySelectorAll("tr") : table.querySelectorAll("tbody tr"));
    const allNodeList = [];
    trs.forEach((tr, row) => {
      if (typeof allNodeList[row] === "undefined")
        allNodeList[row] = [];
      const children = Array.from(tr.childNodes);
      let i = 0;
      while (i < tableCols) {
        for (let x = 0, t = children.length; x < t; x++) {
          while (typeof allNodeList[row][i] !== "undefined") {
            i++;
          }
          const c = children[x];
          let cSpan = c.colSpan, rSpan = c.rowSpan;
          for (let rowy = 0; rowy < rSpan; rowy++) {
            for (let colx = 0; colx < cSpan; colx++) {
              if (typeof allNodeList[row + rowy] === "undefined")
                allNodeList[row + rowy] = [];
              allNodeList[row + rowy][i + colx] = useNull && rowy > 0 ? null : c;
            }
          }
          i += cSpan;
        }
      }
    });
    return allNodeList;
  }
  var table_default = {
    cellList,
    col,
    rowCol,
    colSpan,
    rowSpan
  };

  // src/dom.ts
  function domFragment(html, returnHTML = false) {
    let parser = new DOMParser();
    let doc = parser.parseFromString('<html><head><meta charset="utf-8"></head><body>' + html + "</body></html>", "text/html");
    const node = doc.querySelector("body");
    if (!node)
      return null;
    if (returnHTML)
      return node.innerHTML;
    return node.childNodes;
  }
  function appendString2Node(html, target) {
    Array.from(domFragment(html)).forEach((n) => target.appendChild(n));
  }
  function rangeCompareNode(range, node) {
    if (!node || !node.ownerDocument || !range) {
      return 4;
    }
    var nodeRange = node.ownerDocument.createRange();
    try {
      nodeRange.selectNode(node);
    } catch (e) {
      nodeRange.selectNodeContents(node);
    }
    const range_START_TO_START = range.compareBoundaryPoints(Range.START_TO_START, nodeRange);
    const range_END_TO_END = range.compareBoundaryPoints(Range.END_TO_END, nodeRange);
    const range_START_TO_END = range.compareBoundaryPoints(Range.START_TO_END, nodeRange);
    const range_END_TO_START = range.compareBoundaryPoints(Range.END_TO_START, nodeRange);
    const nodeStartsAfterRangeEnd = range_START_TO_END === -1;
    const nodeEndsBeforeRangeStart = range_END_TO_START === 1;
    const nodeStartsAfterRangeStart = range_START_TO_START !== 1;
    const nodeEndsBeforeRangeEnd = range_END_TO_END !== -1;
    if (nodeStartsAfterRangeEnd || nodeEndsBeforeRangeStart)
      return -1;
    if (nodeStartsAfterRangeStart && nodeEndsBeforeRangeEnd)
      return 3;
    if (!nodeStartsAfterRangeStart && !nodeEndsBeforeRangeEnd)
      return 2;
    if (!nodeStartsAfterRangeStart && nodeEndsBeforeRangeEnd)
      return 0;
    if (nodeStartsAfterRangeStart && !nodeEndsBeforeRangeEnd)
      return 1;
    return 4;
  }
  function rangeContainsNode(range, node, includePartial = true) {
    if (includePartial)
      return [0, 1, 3].indexOf(rangeCompareNode(range, node)) !== -1;
    return rangeCompareNode(range, node) === 3;
  }
  function selectNodesBetweenRange(range) {
    const nodes = [], start = range.startContainer, end = range.endContainer;
    let started = false;
    for (let i = 0, j = range.commonAncestorContainer.childNodes.length; i < j; i++) {
      if (range.commonAncestorContainer.childNodes.item(i).contains(end))
        break;
      if (started) {
        nodes.push(range.commonAncestorContainer.childNodes.item(i));
      }
      if (range.commonAncestorContainer.childNodes.item(i).contains(start))
        started = true;
    }
    return nodes;
  }
  function selectDeepNodesInRange(range) {
    const commonAncestor = range.commonAncestorContainer;
    let start = range.startContainer, startOffset = range.startOffset, end = range.endContainer, endOffset = range.endOffset;
    if (range.startContainer.childNodes.length && range.startContainer.childNodes[range.startOffset]) {
      start = range.startContainer.childNodes[range.startOffset];
      startOffset = 0;
    }
    if (end.nodeType !== Node.TEXT_NODE) {
      end = range.endContainer.childNodes[range.endOffset];
      endOffset = 0;
    }
    let begin = false, finish = false, nodes = [];
    if (range.collapsed) {
      nodes.push({
        node: start,
        startOffset,
        endOffset,
        isVoid: nodeIsVoid(start),
        partial: false,
        collapsed: true
      });
      return nodes;
    }
    const recursive = function(node) {
      var _a, _b;
      if (finish)
        return;
      if (!commonAncestor.contains(node))
        return;
      if (node === start) {
        begin = true;
      } else if (node === end) {
        finish = true;
      }
      if (begin && !node.childNodes.length) {
        if (node === start) {
          let partial = startOffset !== 0;
          if (startOffset === 0 && end === start && end.nodeType === Node.TEXT_NODE) {
            partial = endOffset !== ((_a = end.textContent) == null ? void 0 : _a.length);
          }
          nodes.push({
            node,
            startOffset,
            endOffset: end === start ? endOffset : (_b = start.textContent) == null ? void 0 : _b.length,
            isVoid: nodeIsVoid(node),
            partial,
            collapsed: range.collapsed
          });
        } else if (node === end && node !== start && end.nodeType === Node.TEXT_NODE && endOffset !== 0) {
          nodes.push({
            node,
            startOffset: 0,
            endOffset,
            isVoid: nodeIsVoid(node),
            partial: endOffset < end.textContent.length
          });
        } else if (node !== end) {
          nodes.push({
            node,
            isVoid: nodeIsVoid(node),
            partial: false
          });
        }
      } else if (node.childNodes.length) {
        Array.from(node.childNodes).forEach((n) => recursive(n));
      }
    };
    recursive(commonAncestor);
    return nodes;
  }
  function nodeReplaceWith(node, replaceNodes) {
    if (replaceNodes.length === 0)
      return;
    const parent = node.parentNode;
    if (!parent)
      return;
    replaceNodes.forEach((replaceNode) => {
      parent.insertBefore(replaceNode, node);
    });
    parent.removeChild(node);
  }
  function nodeTextMerge(nodes) {
    if (nodes.length === 0)
      return;
    for (let i = nodes.length - 1; i >= 0; i--) {
      let current = nodes[i];
      if (!current || current.nodeType !== Node.TEXT_NODE)
        continue;
      let previous = current.previousSibling;
      if (current && previous && previous.nodeType === Node.TEXT_NODE) {
        previous.textContent += current.textContent || "";
        current.parentNode.removeChild(current);
      }
    }
  }
  function nodeTextMergeAll(parent) {
    if (!parent)
      return;
    let textNodes = [];
    let recursor = (container) => {
      for (var i = 0; i < container.childNodes.length; i++) {
        var child = container.childNodes[i];
        if (child.nodeType !== Node.TEXT_NODE && child.childNodes) {
          recursor(child);
        } else {
          textNodes.push(child);
        }
      }
    };
    Array.from(parent.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE)
        textNodes.push(node);
      else if (node.childNodes)
        recursor(node);
    });
    nodeTextMerge(textNodes);
  }
  function wrapNode(node, placeholder) {
    var _a;
    if (!node)
      return;
    (_a = node.parentElement) == null ? void 0 : _a.insertBefore(placeholder, node);
    placeholder.appendChild(node);
  }
  function unwrapNode(node, container = void 0) {
    if (!node)
      return;
    const parent = node.parentNode;
    if (!parent || node === container)
      return;
    while (node.firstChild)
      parent.insertBefore(node.firstChild, node);
    parent.removeChild(node);
  }
  function unwrapNodes(nodes, tag, container, range) {
    let unwrapnodes = [];
    if (nodes.length === 0)
      return;
    const tagMatch = (el, _tag) => typeof _tag === "string" ? el.tagName.toLowerCase() === _tag : _tag.indexOf(el.tagName.toLowerCase()) !== -1;
    const rangeMatch = (_range, el) => !_range || rangeContainsNode(_range, el, false);
    const tagQuerySelector = typeof tag === "string" ? tag : tag.join(",");
    nodes.forEach((node) => {
      if (node.nodeType === 3)
        return;
      Array.prototype.forEach.call(node.children, (el) => {
        el.querySelectorAll(tagQuerySelector).forEach((el2) => {
          if (tagMatch(el2, tag) && rangeMatch(range, el2)) {
            unwrapnodes.push(el2);
          }
        });
        if (tagMatch(el, tag) && rangeMatch(range, el)) {
          unwrapnodes.push(el);
        }
      });
      if (tagMatch(node, tag) && rangeMatch(range, node)) {
        unwrapnodes.push(node);
      }
    });
    unwrapnodes.forEach((node) => unwrapNode(node, container));
  }
  function AttributeCompare(a, b) {
    if (a === b)
      return true;
    const a_keys = Object.keys(a), b_keys = Object.keys(b);
    a_keys.sort();
    b_keys.sort();
    if (a_keys.join("_") !== b_keys.join("_"))
      return false;
    const a_value = Object.values(a), b_value = Object.values(b);
    a_value.sort();
    b_value.sort();
    if (a_value.join("_") !== b_value.join("_"))
      return false;
    return true;
  }
  function mergeTags(container, tag) {
    var _a, _b, _c, _d, _e, _f;
    if (!container || container.nodeType === 3)
      return;
    let nodes = container.querySelectorAll(tag);
    let length = nodes.length;
    if (!nodes || length === 0)
      return;
    for (let i = length - 1; i >= 0; i--) {
      let cur = nodes[i], prev = cur.previousElementSibling;
      if (!cur.hasChildNodes() && cur.textContent === "") {
        (_a = cur.parentNode) == null ? void 0 : _a.removeChild(cur);
        continue;
      }
      if (prev && prev.nodeName.toLowerCase() === tag) {
        if (prev.nodeType === 3) {
          prev.textContent += cur.textContent || "";
          (_b = cur.parentNode) == null ? void 0 : _b.removeChild(cur);
        } else if (AttributeCompare(nodeAttrStyle2(prev), nodeAttrStyle2(cur))) {
          nodeChildInsertInto(prev, cur);
          (_c = cur.parentNode) == null ? void 0 : _c.removeChild(cur);
        }
      }
    }
    nodes = container.querySelectorAll(tag + " > " + tag);
    length = nodes.length;
    if (!nodes || length === 0)
      return;
    for (let i = length - 1; i >= 0; i--) {
      if (nodes[i].parentElement && ((_d = nodes[i].parentElement) == null ? void 0 : _d.nodeName.toLowerCase()) === tag && AttributeCompare(nodeAttrStyle2(nodes[i].parentElement), nodeAttrStyle2(nodes[i]))) {
        for (let x = 0, n = nodes[i].childNodes.length; x < n; x++) {
          (_e = nodes[i].parentElement) == null ? void 0 : _e.insertBefore(nodes[i].childNodes[x], nodes[i]);
        }
        (_f = nodes[i].parentNode) == null ? void 0 : _f.removeChild(nodes[i]);
      }
    }
  }
  function nodeAttrStyle2(el, tag) {
    let styles = {};
    if (!el || !el.style)
      return styles;
    const s = (el.getAttribute("style") || "").split(";");
    s.forEach((pair) => {
      if (!pair.trim())
        return;
      const idx = pair.indexOf(":");
      if (idx === -1)
        return;
      let p = [pair.substring(0, idx).trim(), (pair.substring(idx + 1) || "").trim()];
      styles[p[0]] = p[1];
      if (p[0] === "background" && p[1].indexOf("url(") === 0) {
        styles[p[0]] = el.style.background;
      }
    });
    if (tag)
      return styles[tag] || "";
    return styles;
  }
  function nodeReplaceAttrStyle(el, tag, value) {
    let styles = "";
    const s = (el.getAttribute("style") || "").split(";");
    s.forEach((pair) => {
      if (!pair.trim())
        return;
      let p = pair.split(":"), prop = p[0].trim();
      if (prop !== tag) {
        styles += prop + ":" + p[1].trim() + ";";
      }
    });
    if (value) {
      styles += tag + ":" + value + ";";
    }
    if (styles)
      el.setAttribute("style", styles);
    else
      el.removeAttribute("style");
  }
  function nodeChildRemoveAttrStyle(el, tag, value) {
    let unwraps = [];
    Array.from(el.querySelectorAll("*")).forEach((node) => {
      if (node.nodeType === 3)
        return;
      let styles = "";
      const s = (node.getAttribute("style") || "").split(";");
      s.forEach((pair) => {
        if (!pair.trim())
          return;
        let p = pair.split(":"), prop = p[0].trim(), val = p[1].trim();
        if (prop !== tag && value !== val)
          styles += prop + ":" + val + ";";
      });
      if (styles === "" && node.nodeName.toLowerCase() === "span") {
        unwraps.push(node);
        return;
      }
      node.setAttribute("style", styles);
    });
    if (unwraps.length === 0)
      return;
    unwraps.forEach((node) => {
      unwrapNode(node);
    });
  }
  function nodeBreak(container, midNode) {
    if (container === midNode || !container.contains(midNode))
      return;
    let grandparent = null;
    for (let parent = midNode.parentNode; container != parent; parent = grandparent) {
      let right = document.createElement(parent.nodeName);
      while (midNode.nextSibling)
        right.appendChild(midNode.nextSibling);
      grandparent = parent.parentNode;
      grandparent.insertBefore(right, parent.nextSibling);
      grandparent.insertBefore(midNode, right);
    }
  }
  function nodesAreTextInlineOrVoid(nodes) {
    let test = true;
    nodes.forEach((n) => {
      if (!nodeIsTextOrVoid(n) && !nodeIsInlineFormat(n)) {
        test = false;
      }
    });
    return test;
  }
  function nodesAreTextOrVoid(nodes) {
    let test = true;
    nodes.forEach((n) => {
      if (!nodeIsTextOrVoid(n)) {
        test = false;
      }
    });
    return test;
  }
  function nodeIsTextInlineOrVoid(n) {
    return nodeIsTextOrVoid(n) || nodeIsInlineFormat(n);
  }
  function nodeIsTextOrVoid(n) {
    return n && n.nodeType === Node.TEXT_NODE || nodeIsVoid(n);
  }
  function nodeIsText(n) {
    return n && n.nodeType === Node.TEXT_NODE;
  }
  function nodeIsVoid(n) {
    return n && [
      "EMBED",
      "COL",
      "BASE",
      "AREA",
      "IMG",
      "BR",
      "HR",
      "LINK",
      "META",
      "PARAM",
      "SOURCE",
      "TRACK",
      "WBR"
    ].indexOf(n.nodeName) !== -1;
  }
  function nodeIsInlineFormat(n) {
    return n && ["STRONG", "U", "EM", "I", "STRIKE", "SUB", "SUP", "SPAN"].indexOf(n.nodeName) !== -1;
  }
  function nodeChildFirst(n) {
    let last = n;
    while (last && last.childNodes) {
      if (!last.childNodes || last.childNodes.length === 0)
        break;
      last = last.childNodes[0];
    }
    return last;
  }
  function nodeChildLast(n) {
    let last = n;
    while (last && last.childNodes) {
      if (!last.childNodes || last.childNodes.length === 0 || last.childNodes.length === 1 && nodeIsVoid(last.childNodes[0]))
        break;
      last = last.childNodes[last.childNodes.length - 1];
    }
    return last;
  }
  function nodeChildInsertInto(target, node) {
    if (!target || !node || node.childNodes.length === 0 || nodeIsTextOrVoid(target))
      return;
    Array.from(node.childNodes).forEach((el) => target.appendChild(el));
  }
  function nodeChildInsertBefore(target, beforeNode, node) {
    if (!target || !beforeNode || !node || node.childNodes.length === 0 || nodeIsTextOrVoid(target))
      return;
    let idx = nodePosition(beforeNode);
    if (idx === -1)
      return;
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
      if (node.childNodes[i])
        target.insertBefore(node.childNodes[i], target.childNodes[idx]);
    }
  }
  function nodesInsertAfter(nodes, dest) {
    if (!nodes || !dest)
      return;
    let idx = nodePosition(dest);
    if (idx === -1)
      return;
    if (idx === dest.parentNode.childNodes.length - 1) {
      for (let i = 0, n = nodes.length; i < n; i++) {
        dest.parentNode.appendChild(nodes[i]);
      }
    } else {
      const beforeNode = dest.parentNode.childNodes[idx + 1];
      nodes.forEach((n) => dest.parentNode.insertBefore(n, beforeNode));
    }
  }
  function nodePosition(n) {
    if (!n.parentNode || !n.parentNode.childNodes)
      return -1;
    for (let i = 0, nx = n.parentNode.childNodes.length; i < nx; i++) {
      if (n.parentNode.childNodes[i] === n) {
        return i;
      }
    }
    return -1;
  }
  function nodePrev(n, container) {
    let prev = n;
    if (prev !== container) {
      if (prev.previousSibling) {
        prev = prev.previousSibling;
      } else if (prev.parentNode && prev.parentNode === container) {
        prev = container;
      } else if (prev.parentNode) {
        prev = prev.parentNode;
        while (prev !== container && !prev.previousSibling) {
          prev = prev.parentNode;
        }
      }
    }
    return prev;
  }
  function nodeParentUntil(node, until) {
    const path = [];
    while (node && node !== until) {
      path.push(node);
      node = node.parentNode;
    }
    return path;
  }
  function nodeParent(n, tag, container) {
    if (!n)
      return null;
    if (!tag) {
      if (n.parentNode)
        return n.parentNode;
      else
        return null;
    } else if (tag && nodeNameCompare(n, tag))
      return n;
    let x = n;
    while (!nodeNameCompare(x, tag) && (!container || x !== container)) {
      if (!x.parentNode)
        return null;
      x = x.parentNode;
    }
    if (nodeNameCompare(x, tag))
      return x;
    return null;
  }
  function nodeNext(n, container) {
    let next = n;
    if (next !== container) {
      if (next.nextSibling) {
        next = next.nextSibling;
      } else if (next.parentNode && next.parentNode === container) {
        next = container;
      } else if (next.parentNode) {
        next = next.parentNode;
        while (next !== container && !next.nextSibling) {
          if (!next.parentNode)
            break;
          next = next.parentNode;
        }
      }
    }
    return next;
  }
  function getRangeFocus(container) {
    let selection = getSelection();
    if (!selection || selection.rangeCount === 0) {
      container.focus();
      selection = getSelection();
    }
    if (!selection) {
      resetSelection(container);
      selection = getSelection();
    }
    if (selection && selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return false;
  }
  function getRange() {
    const selection = getSelection();
    if (selection && selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return false;
  }
  function getSelection() {
    return window.getSelection();
  }
  function setCaretAt(node, startOffset = 0) {
    const selection = getSelection();
    selection.removeAllRanges();
    const range = document.createRange();
    if (node.nodeType === Node.TEXT_NODE && (node.textContent || "").length < startOffset + 1) {
      range.setEnd(node, node.textContent.length);
      range.collapse(false);
    } else if (node.nodeType !== Node.TEXT_NODE && node.childNodes.length < startOffset + 1) {
      range.setEnd(node.parentNode, Math.min(nodePosition(node) + 1, node.parentNode.childNodes.length));
      range.collapse(false);
    } else {
      range.setStart(node, startOffset);
      range.collapse(true);
    }
    selection.addRange(range);
  }
  function resetSelection(node, startOffset = -1, endOffset = -1) {
    let selection = getSelection();
    if (!selection)
      return;
    let range = getRange();
    selection.removeAllRanges();
    if (!node && !range.endContainer)
      return;
    if (!node.parentNode) {
      node = range.endContainer;
    }
    if (startOffset === -1 && node.nodeType === 3)
      startOffset = node.textContent.length - 1;
    if (startOffset === -1 && node.nodeType !== 3)
      startOffset = node.childNodes.length - 1;
    if (node.nodeType === 3) {
      selection.collapse(node, Math.min(Math.max(startOffset, endOffset, 0), node.textContent.length));
    } else if (nodeNameCompare(node, "br")) {
      selection.collapse(node);
    } else {
      selection.collapse(node, Math.min(Math.max(startOffset, endOffset, 0), node.childNodes.length));
    }
    if (startOffset === -1) {
      selection.selectAllChildren(node);
      selection.collapseToEnd();
    }
    if (!selection.rangeCount) {
      range = document.createRange();
      range.setStart(node, Math.min(Math.max(startOffset, 0), node.textContent.length));
      range.setEnd(node, Math.min(Math.max(startOffset, endOffset, 0), node.textContent.length));
      window.getSelection().addRange(range);
      selection = window.getSelection();
      return;
    }
    range = selection.getRangeAt(0);
    if (startOffset === -1) {
      selection.collapseToEnd();
    } else {
      if (startOffset === 0)
        range.setStart(node, startOffset);
      else {
        range.setStart(node, Math.min(node.childNodes.length ? node.childNodes.length : node.textContent.length, startOffset));
      }
      if (endOffset < startOffset)
        endOffset = startOffset;
      range.setEnd(node, Math.min(node.childNodes.length ? node.childNodes.length : node.textContent.length, endOffset));
    }
    return selection;
  }
  function nodeNameCompareIndex(n, name) {
    let index = -1;
    if (!n || !n.nodeName)
      return index;
    if (typeof name === "string")
      return n && n.nodeName && n.nodeName.toString() === name.toUpperCase() ? 0 : -1;
    return name.indexOf(n.nodeName.toString());
  }
  function nodeNameCompare(n, name) {
    if (typeof name === "string")
      return n && n.nodeName && n.nodeName.toString() === name.toUpperCase();
    return n && name.indexOf(n.nodeName.toString()) !== -1;
  }
  var exp = {
    domFragment,
    appendString2Node,
    rangeCompareNode,
    rangeContainsNode,
    selectDeepNodesInRange,
    nodeReplaceWith,
    nodeTextMerge,
    nodeTextMergeAll,
    wrapNode,
    unwrapNode,
    unwrapNodes,
    mergeTags,
    nodeAttrStyle: nodeAttrStyle2,
    nodeReplaceAttrStyle,
    nodeChildRemoveAttrStyle,
    nodeIsVoid,
    nodeIsText,
    nodeIsTextOrVoid,
    selectNodesBetweenRange,
    nodeIsTextInlineOrVoid,
    nodesAreTextOrVoid,
    getSelection,
    getRange,
    getRangeFocus,
    resetSelection,
    nodeIsInlineFormat,
    nodesAreTextInlineOrVoid,
    nodeNext,
    nodeChildFirst,
    nodeChildLast,
    nodePrev,
    nodeNameCompare,
    nodeNameCompareIndex,
    nodeParentUntil,
    nodeParent,
    nodeChildInsertBefore,
    nodeChildInsertInto,
    nodePosition,
    nodesInsertAfter,
    setCaretAt,
    nodeBreak,
    table: table_default
  };
  var dom_default = exp;

  // src/toolbar.ts
  var _Toolbar = class {
    constructor(editor) {
      this.refToolbar = document.createElement("div");
      this.refShadow = document.createElement("div");
      this.refTips = document.createElement("div");
      this.pluginItemList = {};
      this.preparedItemList = {};
      this.renderButton = (item) => {
        if (!item.command || !item.svg)
          return "";
        return '<span class="se-button se-ToolbarItem" data-command="' + item.command + '" data-tips="' + this.editor.ln(item.tips || "") + '"><span class="se-icon">' + item.svg + "</span></span>";
      };
      this.hideDropdownListener = (e) => {
        if (!this.refToolbar) {
          document.removeEventListener("click", this.hideDropdownListener);
          return;
        }
        let target = e.target;
        let isDropdownContent = false;
        do {
          if (target && target.classList.contains("se-dropdown-content")) {
            isDropdownContent = true;
            break;
          }
        } while (target = target.parentElement);
        if (!isDropdownContent && !this.refToolbar.querySelector(".se-ToolbarItem.is-active .se-dropdown-content .se-button.close-dropdown")) {
          this.hideDropdown();
        }
      };
      this.editor = editor;
      this.prepareUI();
      this.registerEvents();
    }
    prepareUI() {
      var _a;
      (_a = this.editor.refEditor.querySelector(".SubEditorToolbar")) == null ? void 0 : _a.remove();
      this.refToolbar = this.editor.refEditor.insertBefore(document.createElement("div"), this.editor.refContent.parentElement);
      this.refToolbar.classList.add("SubEditorToolbar");
      this.refShadow.classList.add("se-Shadow");
      this.refToolbar.appendChild(this.refShadow);
      this.refTips.classList.add("se-tips");
      this.refToolbar.appendChild(this.refTips);
    }
    registerPluginItem(item) {
      const ToolbarItem2 = typeof item === "function" ? item(this.editor) : item;
      this.pluginItemList = Object.assign(this.pluginItemList, ToolbarItem2);
    }
    prepareItemList() {
      this.preparedItemList = {};
      Object.keys(SubEditor.toolbarItemList).forEach((key) => {
        if (typeof SubEditor.toolbarItemList[key] === "function") {
          this.preparedItemList = Object.assign(this.preparedItemList, SubEditor.toolbarItemList[key](this.editor));
        } else {
          this.preparedItemList[key] = SubEditor.toolbarItemList[key];
        }
      });
      Object.keys(this.pluginItemList).forEach((key) => {
        this.preparedItemList[key] = this.pluginItemList[key];
      });
      Object.keys(_Toolbar.presetItemList).forEach((key) => {
        if (typeof _Toolbar.presetItemList[key] === "function") {
          this.preparedItemList = Object.assign(this.preparedItemList, _Toolbar.presetItemList[key](this.editor));
        } else {
          this.preparedItemList[key] = _Toolbar.presetItemList[key];
        }
      });
    }
    addItem(item) {
      let barItem = void 0;
      if (typeof item === "string") {
        if (typeof this.preparedItemList[item] !== "undefined")
          barItem = this.preparedItemList[item];
        else
          return;
      } else if (typeof item === "function")
        barItem = item(this.editor);
      if (!barItem || typeof barItem === "string" || typeof barItem.command === "undefined")
        return;
      let div = document.createElement("div");
      if (!barItem.dropdowncontent) {
        div.innerHTML = this.renderButton(barItem);
      } else if (barItem.dropdowncontent) {
        div.innerHTML = barItem.dropdowncontent;
      }
      const barItemEl = div.firstChild;
      this.refToolbar.insertBefore(barItemEl, this.refShadow);
      if (barItem.onRender) {
        barItem.onRender(this.editor, barItemEl);
      } else {
        barItemEl.addEventListener("click", (e) => {
          const cmd = barItemEl.getAttribute("data-command");
          this.editor.command(cmd, []);
        });
      }
      div.remove();
    }
    initEventTips(el) {
      el.addEventListener("mouseenter", (e) => {
        e.stopPropagation();
        const elTarget = e.target;
        const tips_str = this.editor.ln(elTarget.getAttribute("data-tips") || "");
        if (tips_str === "")
          return;
        this.refTips.style.display = "block";
        this.refTips.innerHTML = tips_str;
        const toolbarRect = this.refToolbar.getBoundingClientRect();
        let rect = elTarget.getBoundingClientRect();
        this.refTips.style.left = Math.max(0, rect.left - toolbarRect.left + elTarget.clientWidth / 2 - this.refTips.clientWidth / 2) + "px";
        this.refTips.style.top = rect.top - toolbarRect.top - this.refTips.clientHeight + "px";
        if (rect.top < rect.height) {
          this.refTips.style.top = rect.height + "px";
        }
      });
      el.addEventListener("mouseleave", (e) => {
        e.stopPropagation();
        this.refTips.style.display = "none";
        this.refTips.style.top = "";
      });
    }
    initItems(items) {
      this.prepareItemList();
      items.forEach((item) => this.addItem(item));
      this.refToolbar.querySelectorAll("[data-tips]").forEach((el) => this.initEventTips(el));
    }
    insertCloseButton(itemEl) {
      this.removeCloseButton(itemEl);
      this.editor.dom.appendString2Node('<button class="se-button close-dropdown"><span class="se-icon">' + SubEditor.svgList["close"] + "</span></button>", itemEl.querySelector(".se-dropdown-content"));
      itemEl.querySelector(".se-dropdown-content .se-button.close-dropdown").addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.hideDropdown();
        return false;
      });
    }
    removeCloseButton(itemEl) {
      const btn = itemEl.querySelector(".se-dropdown-content .se-button.close-dropdown");
      if (btn)
        btn.remove();
    }
    registerEvents() {
      this.refToolbar.addEventListener("click", (e) => {
        const el = e.target;
        if (el.classList.contains("se-button") && el.parentElement.classList.contains("se-dropdown-trigger")) {
          e.preventDefault();
          e.stopPropagation();
          const menu = el.parentElement.parentElement;
          const isActive = menu.classList.contains("is-active");
          this.hideDropdown();
          if (isActive) {
            menu.classList.remove("is-active");
          } else {
            menu.classList.add("is-active");
            this.adjustContentPosition(menu.querySelector(".se-dropdown-content"));
            menu.querySelectorAll(".se-dropdown-content [data-tips]").forEach((e2) => this.initEventTips(e2));
          }
          return false;
        }
        return true;
      });
      if (typeof this.editor.docListener["click"] === "undefined") {
        this.editor.docListener["click"] = [];
      }
      this.editor.docListener["click"].push(this.hideDropdownListener);
      document.removeEventListener("click", this.hideDropdownListener);
      document.addEventListener("click", this.hideDropdownListener);
      this.editor.event.register([{ event: "onFeatureChange", target: [], callback: () => {
        this.refToolbar.querySelectorAll("[data-command]").forEach((el) => {
          var _a;
          const cmd = el.getAttribute("data-command") || "_";
          if (cmd === "_")
            return;
          el.classList.remove("is-featured");
          if (el.getAttribute("data-featureformat")) {
            if (((_a = this.editor.feature) == null ? void 0 : _a.formatEL) === el.getAttribute("data-featureformat")) {
              el.classList.add("is-featured");
            }
          } else if (typeof this.editor.feature[cmd] !== "undefined" && this.editor.feature[cmd]) {
            el.classList.add("is-featured");
          }
        });
      } }]);
    }
    adjustContentPosition(ddcontent) {
      ddcontent.removeAttribute("style");
      setTimeout(() => {
        const rect = ddcontent.getBoundingClientRect();
        if (!rect.width)
          return;
        let xNew = rect.width / 2 - 18;
        if (rect.x - xNew < 0)
          xNew = rect.x;
        ddcontent.parentElement.setAttribute("style", "transform:translateX(-" + xNew + "px)");
      }, 1);
    }
    hideDropdown() {
      this.refToolbar.querySelectorAll(".se-ToolbarItem.is-active").forEach((el) => el.classList.remove("is-active"));
    }
    hasShadow() {
      return this.refToolbar.classList.contains("EnableShadow");
    }
    enableShadow(allowCmds) {
      this.disableShadow();
      this.refToolbar.classList.add("EnableShadow");
      this.refToolbar.querySelectorAll(".se-ToolbarItem").forEach((e) => {
        let cmd = e.getAttribute("data-command") || "";
        let allow = allowCmds.indexOf(cmd) !== -1;
        if (!allow) {
          e.querySelectorAll("[data-command]").forEach((e2) => {
            if (!allow && allowCmds.indexOf(e2.getAttribute("data-command") || "") !== -1) {
              allow = true;
            }
          });
        }
        if (allow) {
          e.classList.add("AboveShadow");
        }
      });
    }
    disableShadow() {
      this.refToolbar.classList.remove("EnableShadow");
      this.refToolbar.querySelectorAll(".AboveShadow").forEach((e) => e.classList.remove("AboveShadow"));
    }
  };
  var Toolbar = _Toolbar;
  Toolbar.presetItemList = {};

  // src/subeditor.ts
  var import_selection_serializer2 = __toModule(require_selection_serializer());
  "use strict";
  var _SubEditor = class {
    constructor(el, opts) {
      this.cfgList = {};
      this.cachedList = {};
      this.lang = "en";
      this.autoGrow = false;
      this.height = 0;
      this.cacheTextareaStyle = "";
      this.debounceChange = () => {
      };
      this.onChange = () => {
      };
      this.event = new Event(this);
      this.feature = null;
      this.dom = dom_default;
      this.docListener = {};
      this.callbackList = {};
      var _a;
      _SubEditor.initSvg(opts.svgList || {});
      _SubEditor.initLang(opts.langList || {});
      if (typeof el._SubEditor !== "undefined") {
        el._SubEditor.destroy();
      }
      if (opts.lang)
        this.lang = opts.lang;
      if (opts.ln)
        this.lnFunc = opts.ln;
      if (opts.cfgList)
        this.cfgList = opts.cfgList;
      if (opts.instance)
        opts.instance(this);
      this.refEl = el;
      this.refEl._SubEditor = this;
      this.refEditor = document.createElement("div");
      this.refContent = document.createElement("div");
      this.refFooter = document.createElement("div");
      const contentContainer = document.createElement("div");
      contentContainer.classList.add("SubEditorContentContainer");
      contentContainer.appendChild(this.refContent);
      this.refEditor.appendChild(contentContainer);
      this.refEditor.appendChild(this.refFooter);
      if (el.tagName === "TEXTAREA") {
        this.refTextarea = el;
        (_a = this.refTextarea.parentNode) == null ? void 0 : _a.insertBefore(this.refEditor, this.refTextarea);
      } else {
        this.refTextarea = document.createElement("textarea");
        el.appendChild(this.refEditor);
        el.appendChild(this.refTextarea);
      }
      this.refEditor.classList.add("SubEditor");
      this.refContent.classList.add("SubEditorContent");
      this.refFooter.classList.add("SubEditorFooter");
      this.cacheTextareaStyle = this.refTextarea.getAttribute("style") || "";
      if (opts.width)
        this.refEditor.style.width = opts.width + "px";
      this.height = opts.height ? opts.height : this.refTextarea.clientHeight;
      this.refEditor.style.height = this.height + "px";
      this.refTextarea.style.display = "none";
      this.refTextarea.classList.add("SubEditorTextarea");
      if (opts.value) {
        this.refTextarea.value = opts.value;
      }
      this.refContent.innerHTML = this.refTextarea.value;
      this.refContent.setAttribute("contenteditable", "true");
      this.history = new history_default(this.refContent);
      this.history.Next();
      if (opts.onChange) {
        this.onChange = opts.onChange;
      }
      this.toolbar = new Toolbar(this);
      this.refToolbar = this.refEditor.querySelector(".SubEditorToolbar");
      this.initPlugins(opts.pluginList || []);
      this.initEvents();
      this.event.trigger("registerCss", "", []);
      _SubEditor.initCss(opts.css || "", opts.skipCss === true);
      this.event.trigger("registerSvg", "", []);
      this.event.trigger("registerLanguage", "", []);
      this.event.trigger("registerToolbarItem", "", []);
      this.initToolbarItems(opts.toolbarList || []);
      if (typeof opts.autoGrow !== "undefined")
        this.setAutoGrow(opts.autoGrow);
      this.fixStylePosition();
      this.event.trigger("registerUI", "", []);
    }
    value() {
      const source = this.refEditor.querySelector(".SubEditorSource");
      if (source) {
        return source.value;
      }
      return this.refContent.style.display !== "none" ? this.refContent.innerHTML : this.refTextarea.value;
    }
    ln(key, vars = void 0) {
      if (this.lnFunc)
        return this.lnFunc(key) || key;
      let translated = typeof _SubEditor.langList[this.lang] !== "undefined" && typeof _SubEditor.langList[this.lang][key] !== "undefined" ? _SubEditor.langList[this.lang][key] : key;
      if (vars && vars.length) {
        vars.forEach((v, idx) => {
          translated = translated.replace(new RegExp("{%" + (idx + 1) + "}", "g"), v.toString());
        });
      }
      return translated;
    }
    registerCallback(key, fn) {
      this.callbackList[key] = fn;
    }
    getCallback(key, args = void 0) {
      if (typeof this.callbackList[key] === "undefined")
        return;
      if (typeof this.callbackList[key] === "function")
        return this.callbackList[key].apply(this, args);
      else
        return this.callbackList[key];
    }
    static presetToolbarItem(name, item) {
      Toolbar.presetItemList[name] = item;
    }
    static presetPlugin(pluginName, plugin) {
      _SubEditor.presetPluginList[pluginName] = plugin;
    }
    initPlugins(plugins) {
      plugins.forEach((plugin) => {
        if (typeof plugin === "string") {
          if (typeof _SubEditor.presetPluginList[plugin] !== "undefined") {
            this.event.register(_SubEditor.presetPluginList[plugin]);
          } else if (typeof _SubEditor.pluginList[plugin] !== "undefined") {
            this.event.register(_SubEditor.pluginList[plugin]);
          }
        } else if (typeof plugin === "object" && plugin.length) {
          this.event.register(plugin);
        }
      });
    }
    handleFeature() {
      const sel = dom_default.getSelection();
      if (!sel || !(sel == null ? void 0 : sel.focusNode) || !this.refContent.contains(sel.focusNode))
        return;
      const feature = feature_default(sel.focusNode, this.refContent);
      if (this.feature === feature)
        return;
      this.feature = feature;
      this.event.trigger("onFeatureChange", this.feature.nodeName, [this, this.feature]);
    }
    initEvents() {
      this.debounceChange = debounce_default(() => {
        this.handleChange(this.history.Next());
      }, 300);
      this.refContent.addEventListener("keyup", (e) => {
        this.event.trigger("onKeyUp", e.target.tagName, [this, e]);
        this.debounceChange();
      });
      this.refContent.addEventListener("keydown", (e) => {
        this.event.trigger("onKeyDown", e.target.tagName, [this, e]);
      });
      this.refContent.addEventListener("click", (e) => {
        this.event.trigger("onClick", e.target.tagName, [this, e]);
      });
      this.refContent.addEventListener("mouseup", (e) => {
        this.event.trigger("onMouseUp", e.target.tagName, [this, e]);
      });
      this.refContent.addEventListener("blur", (e) => {
        this.event.trigger("onBlur", e.target.tagName, [this, e]);
      });
      this.refContent.addEventListener("paste", (e) => {
        this.event.trigger("onPaste", e.target.tagName, [this, e]);
      });
      this.docListener["selectionchange"] = [() => {
        let x = dom_default.getSelection().focusNode;
        let isIn = x === this.refContent;
        if (!isIn && x && x !== this.refContent) {
          while (x && x.parentElement) {
            if (x.parentNode === this.refContent) {
              isIn = true;
              break;
            }
            x = x.parentElement;
          }
        }
        if (!isIn) {
          this.selection = void 0;
          return;
        }
        const sel = import_selection_serializer2.default.saveSlim(this.refContent);
        if (JSON.stringify(this.selection) !== JSON.stringify(sel)) {
          this.selection = sel;
          this.handleFeature();
          this.event.trigger("onSelectionChange", "", [this, this.selection]);
        }
      }];
      document.addEventListener("selectionchange", this.docListener["selectionchange"][0]);
    }
    resetSelection() {
      this.selection = import_selection_serializer2.default.saveSlim(this.refContent);
    }
    restoreSelection(sel = void 0) {
      import_selection_serializer2.default.restore(this.refContent, sel ? sel : this.selection);
    }
    getSelectionRange() {
      if (!this.selection) {
        this.resetSelection();
      }
      let selection = dom_default.getSelection();
      const range = selection.getRangeAt(0);
      return { selection, range: range.cloneRange() };
    }
    setCache(key, value) {
      this.cachedList[key] = value;
    }
    getCache(key) {
      return typeof this.cachedList[key] === "undefined" ? void 0 : this.cachedList[key];
    }
    setCfg(key, value) {
      this.cfgList[key] = value;
    }
    getCfg(key) {
      let ln = this.ln(key);
      if (ln && ln !== key)
        return ln;
      return this.cfgList[key] || "";
    }
    command(cmd, value = []) {
      if (!this.selection) {
        this.selection = import_selection_serializer2.default.saveSlim(this.refContent);
      }
      import_selection_serializer2.default.restore(this.refContent, this.selection);
      this.event.trigger("onCommand", cmd, [this, cmd, ...value]);
    }
    disableFooter() {
      this.refFooter.style.display = "none";
      this.fixStylePosition();
    }
    enableFooter(height = 15) {
      this.refFooter.style.display = "block";
      this.refFooter.style.height = height + "px";
      this.fixStylePosition();
    }
    setAutoGrow(grow) {
      if (this.autoGrow === grow)
        return;
      this.autoGrow = grow;
      if (grow) {
        this.refEditor.classList.add("AutoGrow");
        this.refContent.addEventListener("input", this.growFn);
        this.refEditor.style.height = "auto";
        this.refContent.parentElement.style.height = "auto";
      } else {
        this.refEditor.classList.remove("AutoGrow");
        this.refContent.removeEventListener("input", this.growFn);
        this.refEditor.style.height = this.height + "px";
      }
      this.fixStylePosition();
    }
    growFn(ev) {
      ev.target.parentElement.style.height = ev.target.clientHeight + "px";
    }
    fixStylePosition() {
      if (!this.autoGrow) {
        this.refContent.parentElement.style.height = this.refEditor.clientHeight - this.refToolbar.clientHeight - this.refFooter.clientHeight + "px";
      }
    }
    initToolbarItems(toolbarItemList) {
      var _a;
      (_a = this.toolbar) == null ? void 0 : _a.initItems(toolbarItemList);
    }
    destroy() {
      var _a;
      if (this.refEl.nodeName === "TEXTAREA") {
        this.refEl.setAttribute("style", this.cacheTextareaStyle);
        (_a = this.refEl.parentNode) == null ? void 0 : _a.removeChild(this.refEditor);
        this.refEl.classList.remove("SubEditorTextarea");
      } else {
        this.refEl.removeChild(this.refEditor);
        this.refEl.removeChild(this.refTextarea);
      }
      this.cachedList = [];
      this.cfgList = [];
      this.selection = void 0;
      this.feature = null;
      Object.keys(this.docListener).forEach((ev) => {
        this.docListener[ev].forEach((i) => {
          document.removeEventListener(ev, i);
        });
      });
      this.refEl._SubEditor = void 0;
    }
    static presetLang(langList) {
      Object.keys(langList).forEach((ln) => {
        _SubEditor.langList[ln] = Object.assign({}, _SubEditor.langList[ln] || {}, langList[ln]);
      });
    }
    static initLang(langList) {
      if (Object.keys(langList).length > 0)
        _SubEditor.presetLang(langList);
    }
    static presetSvg(_svg) {
      _SubEditor.svgList = Object.assign(_SubEditor.svgList, _svg);
    }
    static initSvg(userSvgList) {
      _SubEditor.svgList = Object.assign({}, _SubEditor.svgList || {}, userSvgList);
    }
    static presetCss(cssString = "") {
      _SubEditor.presetCssString = cssString;
    }
    static lastCss() {
      return _SubEditor.lastCssString;
    }
    static initCss(cssString = "", skipCss = false) {
      let pluginCss = "";
      const SubEditorStyle = document.querySelector("#SubEditorStyle");
      if (skipCss && SubEditorStyle)
        return;
      Object.keys(_SubEditor.pluginCSS).forEach((p) => pluginCss += _SubEditor.pluginCSS[p]);
      const styleStr = _SubEditor.cssString + "\n" + pluginCss + "\n" + _SubEditor.presetCssString + "\n" + cssString;
      _SubEditor.lastCssString = styleStr;
      for (let i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].title && document.styleSheets[i].title === "SubEditorStyle") {
          if (styleStr !== SubEditorStyle.innerHTML) {
            SubEditorStyle.innerHTML = styleStr;
          }
          return;
        }
      }
      const style = window.document.createElement("style");
      style.title = "SubEditorStyle";
      style.setAttribute("id", "SubEditorStyle");
      style.innerHTML = styleStr;
      document.head.appendChild(style);
    }
    changeValue(str) {
      if (this.refEditor) {
        this.refContent.innerHTML = str;
        this.resetSelection();
        this.handleFeature();
        this.handleChange(this.history.Next());
      }
    }
    triggerChange() {
      if (this.refEditor) {
        this.handleFeature();
        this.handleChange(this.history.Next());
      }
    }
    handleChange(changed) {
      this.event.trigger("onBeforeChange", "", [this, changed]);
      if (this.refTextarea.style.display === "none") {
        this.refTextarea.value = this.refContent.innerHTML;
      }
      if (changed && this.onChange)
        this.onChange(changed);
    }
  };
  var SubEditor = _SubEditor;
  SubEditor.version = "0.6.1";
  SubEditor.cssString = "";
  SubEditor.svgList = {};
  SubEditor.langList = {};
  SubEditor.pluginList = {};
  SubEditor.toolbarItemList = {};
  SubEditor.presetPluginList = {};
  SubEditor.presetCssString = "";
  SubEditor.lastCssString = "";
  SubEditor.pluginCSS = {};

  // src/browser.core.js
  "use strict";
  if (typeof window !== "undefined") {
    window.SubEditor = SubEditor;
  }
})();
