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
      function isKeyHotkey2(hotkey, event) {
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
      exports.isKeyHotkey = isKeyHotkey2;
      exports.parseHotkey = parseHotkey;
      exports.compareHotkey = compareHotkey;
      exports.toKeyCode = toKeyCode;
      exports.toKeyName = toKeyName;
    }
  });

  // src/svg/index.ts
  var svg_default = {
    "align_center": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5,6.3H19V8.37H5Zm0,9.33H19V17.7H5ZM7.33,11h9.34V13H7.33Z"></path></svg>',
    "align_justify": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 6.3H19V8.4H5ZM5 15.6H19V17.7H5ZM5 11H19V13H5Z"></path></svg>',
    "align_left": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 6.3H19V8.37H5ZM5 15.63H19V17.7H5ZM5 11H14.33V13H5Z"></path></svg>',
    "align_right": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 6.3H19V8.37H5ZM5 15.63H19V17.7H5ZM9.67 11H19V13H9.67Z"></path></svg>',
    "b": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 5v14h7A3.6 3.6 0 0017 16A3.6 3.6 0 0015 12A3.6 3.6 0 0017 8.5A3.6 3.6 0 0014 5h-7ZM9 7h4.5A2.1 2.1 0 0114.5 9A2.1 2.1 0 0113.5 11h-4.5v-4ZM9 13h4.5A2.1 2.1 0 0114.5 15.5A2.1 2.1 0 0113.5 17h-4.5v-4Z"></path></svg>',
    "background_color": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.85 17.5 11.08 6.5H12.65L17.15 17.5H15.49L14.21 14.17H9.61L8.4 17.5ZM10 13H13.73L12.58 10Q12.06 8.61 11.8 7.72A13.8 13.8 0 0111.2 9.82ZM19 5H5V19H19Z"></path></svg>',
    "blockquote": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.7 5 17.7 5A14 14 0 0012.7 15.5A3.2 3.2 0 0016.2 19A3.5 3.5 0 0019.7 15.5A3 3 0 0015.4 13A14 14 0 0119.7 5ZM11.3 5 9.3 5A14 14 0 004.3 15.5A3.2 3.2 0 007.8 19A3.5 3.5 0 0011.3 15.5A3 3 0 007 13A14 14 0 0111.3 5Z"></path></svg>',
    "character": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.72 17.38H8.72A7.33 7.33 0 015.87 11.55A7.34 7.34 0 016.62 8.2A5.78 5.78 0 018.74 5.86A6.12 6.12 0 0112 5A5.91 5.91 0 0115.18 5.79A6.11 6.11 0 0117.27 8.05A7 7 0 0118.09 11.55A7.33 7.33 0 0115.24 17.38H18.24V19H12.93V17.48A5.68 5.68 0 0016.27 11.84A5.88 5.88 0 0015.09 8.05A3.69 3.69 0 0012 6.56A3.74 3.74 0 008.89 8.06A5.76 5.76 0 007.73 11.74C7.73 14.5 8.83 16.41 11.05 17.48V19H5.72Z"></path></svg>',
    "close": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 16.91 9.94 12 5 7.06 7.1 5 12 9.9 16.91 5 19 7.09 14.1 12 19 16.9 16.93 19 12 14.06 7.09 19Z"></path></svg>',
    "code": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 8.11 7.79 L 9.04 8.72 L 5.76 12 L 9 15.28 L 8.07 16.21 L 4 12 ZM 15.89 7.79 L 15 8.72 L 18.24 12 L 15 15.28 L 15.93 16.21 L 20 12 Z\nM 13 6.5 L 14 6.5 L 11 17 L 10 17  Z"></path></svg>',
    "download": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.44 10.47V15.92H6.56V10.47H5V17.47H19V10.47ZM11.24 6.53H12.8V12.22H14.33L12 15 9.67 12.22H11.24Z"></path></svg>',
    "fullscreen": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 14H5V19H10V17H7ZM5 10H7V7H10V5H5ZM17 17H14V19H19V14H17ZM14 5V7H17V10H19V5Z"></path></svg>',
    "fullscreen_close": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 16H8V19H10V14H5ZM8 8H5V10H10V5H8ZM14 19H16V16H19V14H14ZM16 8V5H14V10H19V8Z"></path></svg>',
    "h1": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 17V7.08H6.31V11.14H11.44V7.08H12.75V17H11.44V12.3H6.31V17ZM19 17H17.79V9.23A6.35 6.35 0 0116.64 10.07A9.14 9.14 0 0115.36 10.69V9.52A7.2 7.2 0 0017.14 8.36A4.42 4.42 0 0018.22 7H19Z"></path></svg>',
    "h2": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 16.39V7.64H6.16V11.24H10.71V7.64H11.86V16.39H10.71V12.27H6.16V16.39ZM19 15.36V16.36H13.22A1.83 1.83 0 0113.34 15.62A4 4 0 0114.05 14.45A10.47 10.47 0 0115.46 13.13A11.44 11.44 0 0017.38 11.27A2.15 2.15 0 0017.88 9.98A1.44 1.44 0 0017.43 8.91A1.62 1.62 0 0016.24 8.47A1.67 1.67 0 0015 9A1.79 1.79 0 0014.52 10.29L13.42 10.18A2.72 2.72 0 0114.27 8.3A2.89 2.89 0 0116.27 7.65A2.75 2.75 0 0118.27 8.35A2.28 2.28 0 0119 10A2.51 2.51 0 0118.78 11A4 4 0 0118.07 12.07A17.75 17.75 0 0116.41 13.61C15.77 14.15 15.41 14.51 15.17 14.71A3.36 3.36 0 0014.72 15.29Z"></path></svg>',
    "h3": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 16.29V7.59H6.15V11.16H10.67V7.59H11.82V16.29H10.67V12.19H6.15V16.29ZM13.31 14 14.37 13.86A2.47 2.47 0 0015 15.16A1.57 1.57 0 0016.08 15.56A1.76 1.76 0 0017.35 15A1.8 1.8 0 0017.87 13.7A1.64 1.64 0 0017.39 12.49A1.66 1.66 0 0016.17 12.01A3 3 0 0015.41 12.13L15.53 11.2H15.7A2.17 2.17 0 0016.93 10.84A1.23 1.23 0 0017.48 9.74A1.32 1.32 0 0017.08 8.74A1.41 1.41 0 0016.08 8.36A1.44 1.44 0 0015.08 8.75A2 2 0 0014.48 10L13.41 9.81A2.75 2.75 0 0114.3 8.15A2.61 2.61 0 0116 7.56A2.9 2.9 0 0117.31 7.86A2.34 2.34 0 0118.23 8.7A2.13 2.13 0 0118.54 9.82A1.82 1.82 0 0118.24 10.82A2.05 2.05 0 0117.35 11.56A2 2 0 0118.54 12.3A2.2 2.2 0 0118.97 13.7A2.58 2.58 0 0118.14 15.63A2.9 2.9 0 0116.04 16.42A2.75 2.75 0 0114.14 15.74A2.65 2.65 0 0113.31 14Z"></path></svg>',
    "h4": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 16.36V7.64H6.15V11.22H10.68V7.64H11.84V16.36H10.68V12.25H6.15V16.36ZM16.75 16.36V14.27H13V13.27L17 7.62H17.87V13.27H19V14.27H17.82V16.36ZM16.75 13.29V9.36L14 13.29Z"></path></svg>',
    "h5": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 16.25V7.6H6.15V11.15H10.64V7.6H11.79V16.25H10.64V12.17H6.15V16.25ZM13.26 14 14.38 13.9A2 2 0 0015 15.12A1.61 1.61 0 0016.09 15.53A1.72 1.72 0 0017.39 14.95A2.17 2.17 0 0017.92 13.41A2 2 0 0017.36 12A1.77 1.77 0 0016 11.45A1.79 1.79 0 0015.07 11.69A1.71 1.71 0 0014.42 12.29L13.42 12.16 14.26 7.72H18.56V8.72H15.14L14.67 11.05A2.84 2.84 0 0116.31 10.51A2.6 2.6 0 0118.22 11.29A2.74 2.74 0 0119 13.29A3.19 3.19 0 0118.32 15.29A2.76 2.76 0 0116.04 16.29A2.78 2.78 0 0114.12 15.63A2.58 2.58 0 0113.26 14Z"></path></svg>',
    "h6": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 16.29V7.6H6.15V11.17H10.67V7.6H11.82V16.29H10.67V12.19H6.15V16.29ZM18.85 9.73 17.78 9.81A2 2 0 0017.38 8.89A1.52 1.52 0 0015.38 8.72A2.51 2.51 0 0014.58 9.8A5.75 5.75 0 0014.28 11.8A2.43 2.43 0 0115.22 10.93A2.53 2.53 0 0116.39 10.64A2.41 2.41 0 0118.21 11.43A2.81 2.81 0 0118.96 13.43A3.43 3.43 0 0118.65 15A2.53 2.53 0 0116.28 16.45A2.75 2.75 0 0114.1 15.45A5 5 0 0113.26 12.21A5.78 5.78 0 0114.19 8.55A2.66 2.66 0 0116.38 7.55A2.34 2.34 0 0118.85 9.72ZM14.49 13.47A2.44 2.44 0 0014.72 14.53A1.73 1.73 0 0015.38 15.3A1.67 1.67 0 0016.26 15.56A1.5 1.5 0 0017.42 15A2.14 2.14 0 0017.91 13.51A2 2 0 0017.43 12.09A1.61 1.61 0 0016.22 11.57A1.69 1.69 0 0014.99 12.09A1.86 1.86 0 0014.49 13.47Z"></path></svg>',
    "hr": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 11H19V13H5Z"></path></svg>',
    "i": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 9l-2 10h2l2-10Zm0.75-3a1 1 0 001 1a1 1 0 10-1-1Z"></path></svg>',
    "image": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.3 7.1V17H4.7V7.1H19.3M21.3 5H2.7V19H21.3ZM7.2 8.4A1.2 1.2 0 108.4 9.5A1.2 1.2 0 007.2 8.4ZM6.8 15.7H13.8L10.3 11ZM12 12.1 14.3 9.9 18.3 15.7H14.6S11.9 12 12 12.1Z"></path></svg>',
    "image_library": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 15.74 5.68 V 13.6 H 4.06 V 5.68 H 15.74 M 17.34 4 H 2.46 V 15.2 H 17.34 Z M 6.06 6.72 A 0.96 0.96 90 1 0 7.02 7.6 A 0.96 0.96 90 0 0 6.06 6.72 Z M 5.74 12.56 H 11.34 L 8.54 8.8 Z M 9.9 9.68 L 11.74 7.92 L 14.94 12.56 H 11.98 S 9.82 9.6 9.9 9.68 Z M 18.94 5.68 H 20.54 V 18.4 H 4.06 V 16.8 H 18.94 Z"></path></svg>',
    "indent": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 9V15L7 12 4 9ZM4 19H20V17H4V19ZM4 7H20V5H4V7ZM9 11H20V9H9V11ZM9 15H20V13H9V15Z"></path></svg>',
    "link": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 10.13 11.39 A 0.3 0.3 0 0 0 10.03 11.19 L 9.17 10.5 A 0.3 0.3 0 0 0 8.919 10.488 L 5.7 13.6 L 5.69 13.61 A 2.37 2.37 0 0 0 5.69 16.95 L 7.07 18.32 A 2.36 2.36 0 0 0 8.73 19 A 2.4 2.4 0 0 0 10.39 18.32 L 13.63 15 A 0.3 0.3 0 0 0 13.63 14.8 L 12.68 13.9 A 0.3 0.3 0 0 0 12.52 13.96 L 9.23 17.24 A 0.74 0.74 0 0 1 8.67 17.47 A 0.71 0.71 0 0 1 8.12 17.24 L 6.75 15.87 A 0.82 0.82 0 0 1 6.75 14.76 Z M 13.88 12.7 A 0.3 0.3 90 0 0 13.98 12.9 L 14.84 13.59 A 0.3 0.3 90 0 0 15.091 13.602 L 18.31 10.49 L 18.32 10.48 A 2.37 2.37 90 0 0 18.32 7.14 L 16.94 5.77 A 2.36 2.36 90 0 0 15.28 5.09 A 2.4 2.4 90 0 0 13.62 5.77 L 10.38 9.09 A 0.3 0.3 90 0 0 10.38 9.29 L 11.33 10.19 A 0.3 0.3 90 0 0 11.49 10.13 L 14.78 6.85 A 0.74 0.74 90 0 1 15.34 6.62 A 0.71 0.71 90 0 1 15.89 6.85 L 17.26 8.22 A 0.82 0.82 90 0 1 17.26 9.33 Z M 14.45 10.63 A 0.36 0.36 0 0 0 14.56 10.39 A 0.33 0.33 0 0 0 14.45 10.16 L 13.85 9.55 A 0.5 0.5 0 0 0 13.61 9.45 A 0.32 0.32 0 0 0 13.37 9.55 L 9.62 13.29 A 0.4 0.4 0 0 0 9.52 13.53 A 0.34 0.34 0 0 0 9.62 13.76 L 10.23 14.37 A 0.4 0.4 0 0 0 10.47 14.47 A 0.32 0.32 0 0 0 10.71 14.37 Z"></path></svg>',
    "next": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 9.89 7.79 L 9 8.72 L 12.24 12 L 9 15.28 L 9.93 16.21 L 14 12 Z"></path></svg>',
    "ol": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.55 6.21H19V8.31H9.55ZM9.55 15.66H19V17.76H9.55ZM9.55 10.94H19V13H9.55ZM6 8.31H5.62V6.84A1.34 1.34 0 015.12 7.14V6.78A1 1 0 005.45 6.59A.76.76 0 005.7 6.27H6ZM5 17.22 5.37 17.22A.3.3 0 005.47 17.44A.26.26 0 005.66 17.52A.28.28 0 005.86 17.43A.37.37 0 006 17.13A.36.36 0 005.92 16.9A.27.27 0 005.73 16.82L5.55 16.82 5.55 16.5A.33.33 0 005.79 16.44A.22.22 0 005.87 16.25A.24.24 0 005.81 16.08A.21.21 0 005.65 16.02A.24.24 0 005.49 16.09A.31.31 0 005.4 16.29L5.05 16.23A.7.7 0 015.16 16A.51.51 0 015.37 15.83A.73.73 0 015.67 15.77A.6.6 0 016.12 15.95A.49.49 0 016.26 16.28A.47.47 0 015.97 16.7A.48.48 0 016.25 16.87A.46.46 0 016.35 17.18A.58.58 0 016.16 17.63A.71.71 0 015.23 17.63A.63.63 0 015 17.22ZM6.35 12.66V13H5A1 1 0 015.13 12.61A3.18 3.18 0 015.57 12.12A2.38 2.38 0 005.9 11.79A.46.46 0 006 11.57A.32.32 0 005.93 11.37A.26.26 0 005.73 11.3A.29.29 0 005.54 11.37A.36.36 0 005.46 11.62L5.07 11.62A.63.63 0 015.28 11.16A.72.72 0 015.72 11A.68.68 0 016.2 11.16A.54.54 0 016.37 11.56A.81.81 0 016.37 11.83A1.08 1.08 0 016.21 12.09A2.59 2.59 0 015.96 12.35L5.72 12.57 5.64 12.68Z"></path></svg>',
    "outdent": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 9V15L4 12 7 9ZM4 19H20V17H4V19ZM4 7H20V5H4V7ZM9 11H20V9H9V11ZM9 15H20V13H9V15Z"></path></svg>',
    "p": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.53 19H10.71V11.16A3.21 3.21 0 018.53 10.24A3 3 0 017.76 8.1A3.44 3.44 0 018.07 6.66A2.7 2.7 0 018.9 5.66A3.21 3.21 0 0110.12 5.13A9.54 9.54 0 0111.76 5H16.24V7H15.39V19H13.62V7H12.53Z"></path></svg>',
    "plus": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.8 5 13.2 5 13.2 10.8 19 10.8 19 13.2 13.2 13.2 13.2 19 10.8 19 10.8 13.2 5 13.2 5 10.8 10.8 10.8Z"></path></svg>',
    "previous": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 14.11 7.79 L 15.04 8.72 L 11.76 12 L 15 15.28 L 14.07 16.21 L 10 12 Z"></path></svg>',
    "redo": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.76 6.74 19 12.08 13.67 14.31 14.86 11.39A6.68 6.68 0 006.78 16.49A3.14 3.14 0 006.66 17.26L5 17.15A8.42 8.42 0 0111.41 9.8H11.41A8.22 8.22 0 0115.56 9.8Z"></path></svg>',
    "remove_format": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.5,17v2h13V17ZM7,13.51,10.53,10,7,6.47,8.5,5,12,8.5,15.51,5,17,6.49,13.5,10,17,13.5,15.52,15,12,11.47,8.49,15Z"></path></svg>',
    "remove_link": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.13 11.35A.41.41 0 0010.03 11.14L9.17 10.45A.33.33 0 008.91 10.45L5.7 13.56H5.7A2.38 2.38 0 005.7 16.91L7.08 18.27A2.29 2.29 0 008.73 19A2.36 2.36 0 0010.39 18.32L13.63 15A.31.31 0 0013.63 14.81L12.63 13.9A.38.38 0 0012.47 13.96L9.23 17.19A.71.71 0 018.67 17.42A.68.68 0 018.12 17.19L6.75 15.82A.8.8 0 016.75 14.72ZM13.88 12.65A.26.26 0 0013.98 12.85L14.84 13.55A.31.31 0 0015.09 13.55L18.31 10.43H18.31A2.38 2.38 0 0018.31 7.09L16.94 5.72A2.39 2.39 0 0013.62 5.72L10.38 9.05A.21.21 0 0010.38 9.24L11.33 10.14A.33.33 0 0011.49 10.09L14.78 6.8A.75.75 0 0115.34 6.57A.78.78 0 0115.89 6.8L17.26 8.18A.83.83 0 0117.26 9.28ZM14.45 10.59A.44.44 0 0014.56 10.35A.41.41 0 0014.45 10.11L13.85 9.51A.58.58 0 0013.61 9.4A.3.3 0 0013.37 9.51L9.62 13.24A.39.39 0 009.52 13.48A.33.33 0 009.62 13.72L10.23 14.32A.41.41 0 0010.47 14.43A.34.34 0 0010.71 14.32ZM15 17.83 16.42 16.42 15 15 15.59 14.42 17 15.83 18.4 14.43 19 15 17.6 16.4 19 17.8 18.41 18.4 17 17 15.6 18.43Z"></path></svg>',
    "remove_list": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 9.67 6.3 H 19 V 8.37 H 9.67 Z M 9.67 15.63 H 14 V 17.7 H 9.67 Z M 5 15.63 H 7.33 V 17.7 H 5 Z M 5 11 H 7.33 V 13 H 5 Z M 5 6.3 H 7.33 V 8.37 H 5 Z M 9.67 11 H 19 V 13 H 9.67 Z M 15 17.83 L 16.42 16.42 L 15 15 L 15.59 14.42 L 17 15.83 L 18.4 14.43 L 19 15 L 17.6 16.4 L 19 17.8 L 18.41 18.4 L 17 17 L 15.6 18.43 Z"></path></svg>',
    "search": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 10.4 6.08 A 4.32 4.32 90 1 0 10.4 14.72 A 4.32 4.32 90 1 0 10.4 6.08 Z M 10.4 7.16 A 2.16 2.16 90 1 1 10.4 13.64 A 2.16 2.16 90 1 1 10.4 7.16 Z M 13.493 13.496 L 17.96 17.24 L 17.24 17.96 L 12.8015 14.033 Z"></path></svg>',
    "strikethrough": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 3 11.3 H 21 v 1.5 H 3 Z M 16.63 13.7 A 3.51 3.51 0 0 1 17 15.29 A 3.25 3.25 0 0 1 15.67 18 a 5.56 5.56 0 0 1 -3.47 1 a 6.25 6.25 0 0 1 -2.62 -0.54 A 4.43 4.43 0 0 1 7.69 17 A 3.71 3.71 0 0 1 7 14.81 V 14.7 H 9 v 0.11 a 2.17 2.17 0 0 0 0.86 1.83 a 3.62 3.62 0 0 0 2.32 0.68 a 3.41 3.41 0 0 0 2.08 -0.54 a 1.76 1.76 0 0 0 0.7 -1.47 a 1.69 1.69 0 0 0 -0.65 -1.43 l -0.27 -0.18 Z M 16.34 7.06 a 4.19 4.19 0 0 0 -1.72 -1.51 A 5.71 5.71 0 0 0 12.11 5 A 5.16 5.16 0 0 0 8.75 6.07 a 3.34 3.34 0 0 0 -1.31 2.7 a 3.26 3.26 0 0 0 0.33 1.43 h 2.59 a 1.63 1.63 0 0 1 -0.65 -1.3 a 1.77 1.77 0 0 1 0.69 -1.51 a 3 3 0 0 1 2 -0.55 a 3.1 3.1 0 0 1 2.11 0.66 a 2.36 2.36 0 0 1 0.73 1.84 v 0.11 H 17 A 3.91 3.91 0 0 0 16.34 7.06 Z"></path></svg>',
    "subscript": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.63 15.22 7.87 11 3.66 6.77 5.43 5 9.64 9.21 13.85 5 15.64 6.79 11.44 11 15.64 15.21 13.87 17 9.66 12.77 5.42 17ZM20.37 18.29V19H16.42A1.24 1.24 0 0116.5 18.49A2.83 2.83 0 0116.98 17.69A8.18 8.18 0 0117.98 16.79A8 8 0 0019.29 15.52A1.5 1.5 0 0019.64 14.64A1 1 0 0019.32 13.9A1.11 1.11 0 0018.51 13.6A1.16 1.16 0 0017.66 13.92A1.2 1.2 0 0017.34 14.8L16.58 14.72A1.86 1.86 0 0117.17 13.44A2 2 0 0118.5 13A1.9 1.9 0 0119.86 13.48A1.58 1.58 0 0120.36 14.66A1.78 1.78 0 0120.21 15.37A2.61 2.61 0 0119.73 16.1A11 11 0 0118.59 17.15A9 9 0 0017.75 17.91A2.12 2.12 0 0017.44 18.3Z"></path></svg>',
    "superscript": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.63 17.21 7.87 13 3.66 8.76 5.43 7 9.64 11.2 13.85 7 15.64 8.8 11.44 13 15.64 17.21 13.87 19 9.66 14.76 5.42 19ZM20.37 10.3V11H16.42A1.3 1.3 0 0116.5 10.49A2.66 2.66 0 0117 9.7A8.15 8.15 0 0118 8.79A8 8 0 0019.31 7.53A1.55 1.55 0 0019.66 6.64A1 1 0 0019.34 5.91A1.11 1.11 0 0018.53 5.61A1.16 1.16 0 0017.68 5.92A1.22 1.22 0 0017.36 6.8L16.6 6.73A1.89 1.89 0 0117.19 5.44A2 2 0 0118.5 5A1.94 1.94 0 0119.86 5.47A1.6 1.6 0 0120.36 6.66A1.73 1.73 0 0120.21 7.36A2.48 2.48 0 0119.73 8.09A12.06 12.06 0 0118.59 9.15Q17.93 9.7 17.75 9.9A1.88 1.88 0 0017.44 10.3Z"></path></svg>',
    "table": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 5H2V19H22ZM9.5 13.5V10.5H14.5V13.5ZM14.5 15V17.5H9.5V15ZM9.5 9V6.5H14.5V9ZM3.5 6.5H8V9H3.5ZM3.5 10.5H8V13.5H3.5ZM3.5 17.5V15H8V17.5ZM20.5 17.5H16V15H20.5ZM20.5 13.5H16V10.5H20.5ZM16 9V6.5H20.5V9Z"></path></svg>',
    "text": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 3.905 17.1 L 8.747 4.5 H 10.547 L 15.704 17.1 H 13.796 L 12.329 13.284 H 7.1 L 5.678 17.1 Z M 7.505 11.925 H 11.771 L 10.493 8.433 C 10.097 7.38 9.8 6.507 9.593 5.823 A 16.479 16.479 90 0 1 8.9 8.226 Z M 17 5 a 1 1 0 1 1 2 0 a 1 1 0 1 1 -2 0 Z M 17 8 a 1 1 0 1 1 2 0 a 1 1 0 1 1 -2 0 Z M 17 11 a 1 1 0 1 1 2 0 a 1 1 0 1 1 -2 0 Z"></path></svg>',
    "text_color": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 5.45 19 L 10.83 5 H 12.83 L 15.4 11.8 L 13 14.76 H 9 L 7.42 19 Z M 9.45 13.25 H 14.19 L 12.77 9.37 C 12.33 8.2 12 7.23 11.77 6.47 A 18.31 18.31 0 0 1 11 9.14 Z M 15.78 12.22 s -2.75 2.98 -2.75 4.82 a 2.79 2.79 90 0 0 5.58 0.08 v -0.08 C 18.61 15.21 15.78 12.22 15.78 12.22 Z"></path></svg>',
    "u": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 3.5v8.5A6.5 6.5 0 0012.5 17.5A6.5 6.5 0 0019 12v-8.5h-2v8.5A4.5 4.5 0 0112.5 15.5A4.5 4.5 0 018 12v-8.5ZM6 18.5v2h13v-2Z"></path></svg>',
    "ul": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.67 6.3H19V8.37H9.67ZM9.67 15.63H19V17.7H9.67ZM5 15.63H7.33V17.7H5ZM5 11H7.33V13H5ZM5 6.3H7.33V8.37H5ZM9.67 11H19V13H9.67Z"></path></svg>',
    "undo": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8.44 9.85A8.22 8.22 0 0112.59 9.85H12.59A8.42 8.42 0 0119 17.15L17.34 17.26A3.14 3.14 0 0017.22 16.49A6.68 6.68 0 009.14 11.39L10.33 14.31 5 12.08 7.24 6.74Z"></path></svg>',
    "upload": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.44 10.47V15.92H6.56V10.47H5V17.47H19V10.47ZM12.76 15H11.2V9.25H9.67L12 6.53 14.33 9.25H12.76Z"></path></svg>',
    "video": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.88 8.71V15.29H6.65V8.71H14.88M16.53 10.71V7.06H5V16.94H16.53V13.24L19 15.24V8.71Z"></path></svg>',
    "view_source": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.11 7.79 10.04 8.72 6.76 12 10 15.28 9.07 16.21 5 12ZM14.89 7.79 14 8.72 17.24 12 14 15.28 14.93 16.21 19 12Z"></path></svg>'
  };

  // src/css/index.ts
  var css_default = ".SubEditor, .SubEditor  * {box-sizing: border-box;}.SubEditor {border:1px solid #dbdbdb;background-color: #fff;position: relative;}.SubEditorContentContainer {overflow-y: auto;padding:10px;}.SubEditor.AutoGrow {height: auto;}.SubEditor.AutoGrow .SubEditorContentContainer{overflow-y: hidden;height: auto;}.SubEditorContent, .SubEditorSource {display:inline-block;min-height: 200px;width:100%;box-shadow: none;border:none;outline: none;}.SubEditorContent:focus, .SubEditorSource:focus{box-shadow: none;border:none;outline: none;}.SubEditorContent img {max-width: 100%;}.SubEditorTextarea {display:none;resize: none;width: 100%;min-height: 100px;padding:10px;overflow: hidden;box-sizing: border-box;}.SubEditor .SubEditorFooter {display: none;border-top: 1px solid #dbdbdb;}.SubEditor > .SubEditorTooltip{user-select: none;z-index: 9999;position: absolute;line-height: 1.2em;display: none;padding: 2px 10px;box-shadow:1px 1px 3px gray;border-radius:5px;background: #fff;white-space: nowrap;}.SubEditor .se-button {box-shadow:none}.SubEditorContent table {border: none;border-collapse: collapse;empty-cells: show;max-width: 100%;}.SubEditorContent table td,.SubEditorContent table th {min-width:20px;min-height: 20px;border: 1px solid #dedede;}.SubEditorContent table th {background-color: #efefef;}.SubEditorContent blockquote{border-left: solid 3px #dedede;margin: 5px;padding-left: 5px;color: #333;}.SubEditorContent h1,.SubEditorContent h2,.SubEditorContent h3,.SubEditorContent h4,.SubEditorContent h5,.SubEditorContent h6{font-size: revert;font-weight: revert;margin: revert;padding: revert;}.SubEditorContent ul, .SubEditorContent ol{display: block;margin-block-start: 1em;margin-block-end: 1em;margin-inline-start: 0px;margin-inline-end: 0px;padding-inline-start: 40px;}.SubEditorContent ul {list-style-type: disc;}.SubEditorContent ol{list-style-type: decimal;}.SubEditorContent p{margin: revert;padding: revert;}.SubEditorToolbar {margin:0;border-bottom:1px solid #dbdbdb;align-items: center;display: flex;flex-wrap: wrap;justify-content: flex-start;font-weight: 400;font-size: 1rem;line-height: 1.5;text-align: left;color: #363636;background-color: #fff;width:100%;position: relative;}.SubEditorToolbar, .SubEditorToolbar  * {user-select: none;}.SubEditorToolbar{ align-items: center;display: flex;flex-wrap: wrap;justify-content: flex-start;}.SubEditorToolbar .se-dropdown {display: inline-flex;position: relative;vertical-align: top;height: 2.25em;border-color: transparent; border-width: 1px; cursor: pointer; justify-content: center; padding: calc(0.375 em - 1 px)  0.75em;text-align: center;}    .SubEditorToolbar .se-dropdown-trigger{position: relative;}.SubEditorToolbar .se-button{margin: 0;align-items: center;border: 1px solid transparent;display: inline-flex;vertical-align: top;background-color: #fff;border-color: transparent;border-width: 1px;border-radius: 3px;cursor: pointer;justify-content: center;padding: calc(.375em - 1px) .75em;text-align: center;white-space: nowrap;position: relative;overflow: hidden;transform: translate3d(0,0,0);transition: box-shadow 280ms cubic-bezier(.4,0,.2,1),background-color 300ms ease;box-shadow: none;}.SubEditorToolbar .se-button .se-icon{margin:0 calc(-.375em - 1px);height: 24px;width: 24px;align-items: center; display: inline-flex;justify-content: center;}.SubEditorToolbar .se-button .se-icon svg {height: 24px;width: 24px;}.SubEditorToolbar .se-dropdown-trigger .se-button * {pointer-events: none;}.SubEditorToolbar .se-dropdown-menu{min-width: unset;left: 0;padding-top: 4px;position: absolute;top: 100%;z-index: 20;display: none;background-color: #fff;}.SubEditorToolbar .se-ToolbarItem.is-active .se-dropdown-menu {display:block}.SubEditorToolbar .se-dropdown-content{border-radius: 4px;box-shadow: 0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);padding: 0;transform-origin: top left;position:relative;background-color: #fff;}.SubEditorToolbar .se-dropdown-content .padding {padding: 15px;}.SubEditorToolbar .se-dropdown-content .se-dropdown-item {cursor: pointer;height:unset;margin-bottom:0;margin: 0;align-items: center;border: 1px solid transparent;display: inline-flex;vertical-align: top;justify-content: center;text-transform: uppercase;transition: box-shadow 280ms cubic-bezier(.4,0,.2,1),background-color 300ms ease;position: relative;overflow: hidden;transform: translate3d(0,0,0);white-space: nowrap;width: 100%;box-shadow: none;height: unset;margin-right: -1px;box-sizing: border-box;}.SubEditorToolbar .se-dropdown-content.se-control .se-dropdown-item {padding:10px 5px;}.SubEditorToolbar .se-dropdown-content .se-dropdown-item input {padding: calc(0.5em - 1px) calc(0.75em - 1px);transition: all 300ms;font-size: 1rem;height: 2.5em;line-height: 2.5em;border: solid 1px #ccc;width:200px;}.SubEditorToolbar .se-dropdown-content .se-button {height: 30px;line-height: 1;}.SubEditorToolbar .se-dropdown-content .se-button.close-dropdown {position: absolute;right:1px;top:1px;}.SubEditorToolbar .se-dropdown-content .se-button.alert {background-color: rgb(244,67,54,1);color: #fff;}.SubEditorToolbar .se-dropdown-content .se-button:hover {background-color: #dbdbdb;}.SubEditorToolbar .se-dropdown-content .se-button.alert:hover {background-color: rgb(244,67,54,0.7);}.SubEditorToolbar .se-dropdown-content .se-dropdown-item input:focus {border: solid 1px #2196f3;}.SubEditorToolbar .se-dropdown-content .se-dropdown-item input+label {position: absolute;top: -1px;left: 12px;padding:3px 2px;font-size: 0.8em;color: #333;transition: all 0.5s ease;z-index: 3;display: block;cursor: text;background-color: #fff;}.SubEditorToolbar .is-featured{border-color: transparent;color: #363636;background-color: #efefef;}.SubEditorToolbar .se-dropdown-content .se-dropdown-item > * {white-space:  nowrap;margin : 0}.SubEditorToolbar .se-dropdown-trigger{position: relative;}.SubEditorToolbar .se-dropdown-content.horizontal {display: flex;flex-wrap: nowrap;align-items: center;justify-content: flex-start;}.SubEditorToolbar > .se-button:hover, .SubEditorToolbar .se-dropdown-trigger .se-button:hover, .SubEditorToolbar .se-dropdown-content .se-dropdown-item.hover:hover,.SubEditorToolbar .se-dropdown-content .se-button.se-ToolbarItem:hover{background-color: #e0e0e0;}.SubEditorToolbar .se-dropdown-content .se-button.se-dropdown-item.borderbottom{border-bottom: 1px solid #dbdbdb;border-radius: 0px;}.SubEditorToolbar >.se-tips{z-index: 9999;position: absolute;top: -1.6em;left: 0px;line-height: 1.2em;display: none;padding: 2px 10px;border: 1px solid #dbdbdb;background: #fff;white-space: nowrap;pointer-events: none;user-select: none;}.SubEditorToolbar .se-Shadow {position:absolute;top:0;left:0;width:100%;height:100%;background-color: rgba(255,255,255,.6);z-index: 100;display: none;}.SubEditorToolbar.EnableShadow .se-Shadow{display: block;}.SubEditorToolbar .se-ToolbarItem.AboveShadow {z-index: 110;}.ToolbarTable td{padding-left: 5px;padding-right: 5px;width:10px; height:10px;border:1px solid #dbdbdb;margin:1px;}.ToolbarTable td.active,.ToolbarTable td:hover{background-color: #e0e0e0;}.ToolbarTable .title{text-align: center;font-size: 12px}.SubEditorDialog {box-sizing: border-box;align-items: center;display: none;flex-direction: column;justify-content: center;overflow: hidden;position: fixed;}.SubEditorDialog.is-active {display: flex;}.SubEditorDialog {z-index: 10000;}.SubEditorDialog .background {box-sizing: border-box;background-color: rgba(10,10,10,.6);}.background {bottom: 0;left: 0;position: absolute;right: 0;top: 0;}.SubEditorDialog .card {box-shadow: 0 7px 8px -4px rgba(0,0,0,.2), 0 13px 19px 2px rgba(0,0,0,.14), 0 5px 24px 4px rgba(0,0,0,.12);}.card {display: flex;flex-direction: column;max-height: calc(100vh - 40px);overflow: hidden;}.card, .content {box-sizing: border-box;margin: 0 20px;position: relative;width: 100%;}.card-title {color: #363636;flex-grow: 1;flex-shrink: 0;font-size: 1.5rem;line-height: 1;}.delete, .close {user-select: none;background-color: rgba(10,10,10,.2);border: 0;border-radius: 290486px;cursor: pointer;pointer-events: auto;display: inline-block;flex-grow: 0;flex-shrink: 0;font-size: 0;height: 20px;max-height: 20px;max-width: 20px;min-height: 20px;min-width: 20px;outline: 0;position: relative;vertical-align: top;width: 20px;}.card-head, .card-foot {box-sizing: border-box;border: none;background: #fff;}.card-head {border-top-left-radius: 6px;border-top-right-radius: 6px;}.card-foot, .card-head {align-items: center;display: flex;flex-shrink: 0;justify-content: flex-start;padding: 20px;position: relative;}.card-foot {justify-content: flex-end;border-bottom-left-radius: 6px;border-bottom-right-radius: 6px;}.card-body {background-color: #fff;flex-grow: 1;flex-shrink: 1;overflow: auto;padding: 20px;display: block;}.SubEditorDialog .button{user-select: none;align-items: center;border: 1px solid transparent;box-shadow: none;display: inline-flex;font-size: 1rem;height: 2.25em;justify-content: flex-start;line-height: 1.5;padding: calc(.375em - 1px) calc(.625em - 1px);position: relative;vertical-align: top;background-color: #fff;border-color: transparent;border-width: 1px;color: #363636;cursor: pointer;justify-content: center;text-align: center;white-space: nowrap;border-radius: 3px;text-transform: uppercase;font-weight: 400;box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);transition: box-shadow 280ms cubic-bezier(.4,0,.2,1),background-color 300ms ease;position: relative;overflow: hidden;transform: translate3d(0,0,0);}.button.is-info, .button.is-info.is-hovered, .button.is-info:hover {border-color: transparent;color: #fff;}.button.is-info {background-color: #29b6f6;}.card-foot .button:not(:last-child) {margin-right: 10px;}@media screen and (min-width: 769px), print {.card, .body {    margin: 0 auto;    max-height: calc(100vh - 40px);    width: 100vw - 40px;}}.SubEditorToolbar .se-dropdown-content .uploadcontainer{position: relative;border: dashed 2px #bdbdbd;border-radius: 3px;width:250px;min-height: 100px;text-align: center;}.SubEditorToolbar .se-dropdown-content .uploadcontainer strong{position:absolute;top:50%;transform: translateY(-50%);display: block;width: 100%;text-align: center;}.SubEditorToolbar .se-dropdown-content .uploadcontainer input{position: absolute;top:0;left:0;width: 100%;height: 100%;opacity: 0;}.FileTileImageGridContainer {max-height: calc(100vh - 140px);margin-bottom:0px;position:relative;overflow-y: auto;}.FileTileImageGridFooter {width: 100%;padding-top: 5px;border-top:#ccc 1px solid;}.FileTileImageGridPagination {justify-content: center;margin-bottom: 0;margin-top: 0;align-items: center;display: flex;text-align: center;border-bottom:none;}.FileTileImageGridPagination > * {padding: 0 0.75em;white-space: nowrap;border: #dbdbdb 1px solid;color: #363636;font-size: 1em;justify-content: center;margin: 1px 5px;text-align: center;-webkit-appearance: none;line-height: 28px;height: 28px; } .FileTileImageGridPagination span.total {border:none;padding: 0;margin-left: 0; } .FileTileImageGridPagination input.current {width: 2.5em;border: none;text-align: center; } .FileTileImageGridPagination input.keyword {width: 6em; } .FileTileImageGridPagination > .se-button {border-radius: 9999px;border: #dbdbdb 1px solid;width: 30px; }.FileTileImageGrid {margin-top:18px;display: flex;flex-wrap: wrap;width:100%;min-width: 640px;max-height: calc(100vh - 140px);overflow-y: visible;}.FileTileImageGrid button {display: inline-block;margin-bottom: 8px;width: calc(20% - 9px);text-decoration: none;margin-right: 8px;padding:5px;background: #ffffff;cursor: pointer;user-select: none;border: 1px solid #eee;min-width: 55px;}.FileTileImageGrid button.upload {position:relative;cursor: pointer;}.FileTileImageGrid button.upload input {position: absolute;width: 100%;height: 100%;top: 0;left: 0;opacity: 0;}/* 4 per row */.FileTileImageGrid a:nth-of-type(5n) {margin-right: 0;}.FileTileImageGrid button > figure {position: relative;width: 100%;padding-top: 100%;margin:0;}.FileTileImageGrid button > figure > figure {position:  absolute;top: 0;left: 0;bottom: 0;right: 0;margin:0;overflow:hidden;}.FileTileImageGrid img{position:absolute;top : 0;left:0;min-width:100%;min-height:100%;width:100%;max-height:100%;border:none;}.FileTileImageGrid figure .text{text-align: center;word-break: break-all;margin: 0;position: absolute;top: 50%;transform: translateY(-50%);display: block;width: 100%;}.FileTileImageGrid button:hover {border: 1px solid #ccc;}.FileTileImageGrid .caption {display:block;margin-top: 6px;max-height:2.2em;overflow: hidden;text-align: center;font-size: 0.7em;}@media screen and (max-width: 768px){.FileTileImageGrid {max-width: 320px;min-width: 320px;}.FileTileImageGrid button {width: calc(25% - 6px);}.FileTileImageGrid button:nth-of-type(2n) {margin-right: 8px;}.FileTileImageGrid button:nth-of-type(5n) {margin-right: 8px;}.FileTileImageGrid button:nth-of-type(4n) {margin-right: 0;}}#dropdown-menu-color .se-dropdown-content .padding > div,#dropdown-menu-background .se-dropdown-content .padding > div {display: flex;}#dropdown-menu-color .se-dropdown-content .padding > div > *,#dropdown-menu-background .se-dropdown-content .padding > div > * {flex-grow: 1;flex-shrink: 1;border-spacing: 0;}#dropdown-menu-color table,#dropdown-menu-background table {flex-grow: 1;flex-shrink: 1;border-spacing: 0;}#dropdown-menu-color table td div,#dropdown-menu-background table td div {cursor:pointer;width:16px;height:16px;padding: 2px;border: 1px solid #dbdbdb;}#dropdown-menu-color table td div:hover,#dropdown-menu-background table td div:hover{border-color:#999;}";

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
        if (!this.events[p.event].find((e) => e === p))
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
    for (let i = f.path.length - 1; i >= 0; i--) {
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
    replaceNodes.forEach((replaceNode2) => {
      parent.insertBefore(replaceNode2, node);
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

  // src/lang/en.ts
  var en_default = {
    "bold": "bold",
    "italic": "italic",
    "underline": "underline",
    "blockquote": "blockquote",
    "paragraph": "paragraph",
    "Normal": "Normal",
    "Heading 1": "Heading 1",
    "Heading 2": "Heading 2",
    "Heading 3": "Heading 3",
    "Heading 4": "Heading 4",
    "Heading 5": "Heading 5",
    "Heading 6": "Heading 6",
    "Code": "Code",
    "text color": "text color",
    "background color": "background color",
    "SET TEXT COLOR": "SET COLOR",
    "SET BACKGROUND COLOR": "SET COLOR",
    "fullscreen": "fullscreen",
    "exit fullscreen": "exit fullscreen",
    "table": "table",
    "align": "align",
    "align left": "align left",
    "align center": "align center",
    "align right": "align right",
    "align justify": "align justify",
    "horizontal line": "horizontal line",
    "view source": "view source",
    "strikethrough": "strikethrough",
    "superscript": "superscript",
    "subscript": "subscript",
    "indent": "indent",
    "outdent": "outdent",
    "format": "format",
    "remove format": "remove format",
    "link": "link",
    "url": "URL",
    "text": "TEXT",
    "link target": "TARGET",
    "remove": "REMOVE",
    "insert": "INSERT",
    "update": "UPDATE",
    "open in new tab": " (open in new tab)",
    "list": "list",
    "ordered list": "ordered list",
    "unordered list": "unordered list",
    "remove list": "remove list",
    "image": "image",
    "uploading": "uploading",
    "upload failed": "upload failed",
    "drop or click to upload image": "drop or click to upload image",
    "please select the appropriate file types:": "please select the appropriate file types:",
    "max allowed size per file should be ": "max allowed size per file should be ",
    "max allowed size of all files in total should be ": "max allowed size of all files in total should be ",
    "UPLOADING...": "UPLOADING...",
    "START OVER": "START OVER"
  };

  // src/lang/zhCN.ts
  var zhCN_default = {
    "bold": "\u7C97\u4F53",
    "italic": "\u659C\u4F53",
    "underline": "\u4E0B\u5212\u7EBF",
    "blockquote": "\u5F15\u7528",
    "paragraph": "\u6BB5\u843D",
    "Normal": "\u6B63\u5E38",
    "Heading 1": "\u6807\u9898 1",
    "Heading 2": "\u6807\u9898 2",
    "Heading 3": "\u6807\u9898 3",
    "Heading 4": "\u6807\u9898 4",
    "Heading 5": "\u6807\u9898 5",
    "Heading 6": "\u6807\u9898 6",
    "Code": "\u4EE3\u7801",
    "text color": "\u6587\u5B57\u989C\u8272",
    "background color": "\u80CC\u666F\u989C\u8272",
    "SET TEXT COLOR": "\u8BBE\u7F6E\u6587\u5B57\u989C\u8272",
    "SET BACKGROUND COLOR": "\u8BBE\u7F6E\u80CC\u666F\u989C\u8272",
    "fullscreen": "\u5168\u5C4F",
    "exit fullscreen": "\u9000\u51FA\u5168\u5C4F",
    "table": "\u8868\u683C",
    "align": "\u5BF9\u9F50",
    "align left": "\u9760\u5DE6",
    "align center": "\u7F6E\u4E2D",
    "align right": "\u9760\u53F3",
    "align justify": "\u5DE6\u53F3\u5BF9\u9F50",
    "horizontal line": "\u6C34\u5E73\u7EBF",
    "view source": "\u67E5\u770B\u6E90\u4EE3\u7801",
    "strikethrough": "\u5220\u9664\u7EBF",
    "superscript": "\u4E0A\u6807",
    "subscript": "\u4E0B\u6807",
    "indent": "\u7F29\u8FDB",
    "outdent": "\u51CF\u5C0F\u7F29\u8FDB",
    "format": "\u683C\u5F0F",
    "remove format": "\u5220\u9664\u683C\u5F0F",
    "link": "\u94FE\u63A5",
    "url": "\u7F51\u5740",
    "text": "\u6587\u672C",
    "link target": "\u94FE\u63A5\u76EE\u6807",
    "remove": "\u5220\u9664",
    "insert": "\u63D2\u5165",
    "update": "\u66F4\u65B0",
    "open in new tab": "\uFF08\u5728\u65B0\u6807\u7B7E\u4E2D\u6253\u5F00\uFF09",
    "list": "\u5217\u8868",
    "ordered list": "\u6570\u5B57\u5217\u8868",
    "unordered list": "\u65E0\u5E8F\u5217\u8868",
    "remove list": "\u5220\u9664\u5217\u8868",
    "image": "\u56FE\u7247",
    "uploading": "\u4E0A\u4F20\u4E2D",
    "upload failed": "\u4E0A\u4F20\u5931\u8D25",
    "drop or click to upload image": "\u62D6\u653E\u6216\u6D4F\u89C8\u6587\u4EF6\u4E0A\u4F20",
    "please select the appropriate file types:": "\u8BF7\u9009\u62E9\u9002\u5F53\u7684\u6587\u4EF6\u7C7B\u578B\uFF1A",
    "max allowed size per file should be ": "\u5355\u4E2A\u6587\u4EF6\u5141\u8BB8\u7684\u6700\u5927\u5927\u5C0F\u5E94\u8BE5\u662F ",
    "max allowed size of all files in total should be ": "\u603B\u6587\u4EF6\u7684\u6700\u5927\u5141\u8BB8\u5927\u5C0F\u5E94\u4E3A ",
    "UPLOADING...": "\u4E0A\u4F20\u4E2D...",
    "START OVER": "\u91CD\u65B0\u5F00\u59CB"
  };

  // src/lang/zhTW.ts
  var zhTW_default = {
    "bold": "\u7C97\u9AD4",
    "italic": "\u659C\u9AD4",
    "underline": "\u4E0B\u5283\u7DDA",
    "blockquote": "\u5F15\u7528",
    "paragraph": "\u6BB5\u843D",
    "Normal": "\u6B63\u5E38",
    "Heading 1": "\u6A19\u984C 1",
    "Heading 2": "\u6A19\u984C 2",
    "Heading 3": "\u6A19\u984C 3",
    "Heading 4": "\u6A19\u984C 4",
    "Heading 5": "\u6A19\u984C 5",
    "Heading 6": "\u6A19\u984C 6",
    "Code": "\u4EE3\u78BC",
    "text color": "\u6587\u5B57\u984F\u8272",
    "background color": "\u80CC\u666F\u984F\u8272",
    "SET TEXT COLOR": "\u8A2D\u7F6E\u6587\u5B57\u984F\u8272",
    "SET BACKGROUND COLOR": "\u8A2D\u7F6E\u80CC\u666F\u984F\u8272",
    "fullscreen": "\u5168\u5C4F",
    "exit fullscreen": "\u9000\u51FA\u5168\u5C4F",
    "table": "\u8868\u683C",
    "align": "\u5C0D\u9F4A",
    "align left": "\u9760\u5DE6",
    "align center": "\u7F6E\u4E2D",
    "align right": "\u9760\u53F3",
    "align justify": "\u5DE6\u53F3\u5C0D\u9F4A",
    "horizontal line": "\u6C34\u5E73\u7DDA",
    "view source": "\u67E5\u770B\u6E90\u4EE3\u78BC",
    "strikethrough": "\u522A\u9664\u7DDA",
    "superscript": "\u4E0A\u6A19",
    "subscript": "\u4E0B\u6A19",
    "indent": "\u7E2E\u9032",
    "outdent": "\u6E1B\u5C0F\u7E2E\u9032",
    "format": "\u683C\u5F0F",
    "remove format": "\u522A\u9664\u683C\u5F0F",
    "link": "\u93C8\u63A5",
    "url": "\u7DB2\u5740",
    "text": "\u6587\u672C",
    "link target": "\u93C8\u63A5\u76EE\u6A19",
    "remove": "\u522A\u9664",
    "insert": "\u63D2\u5165",
    "update": "\u66F4\u65B0",
    "open in new tab": "\uFF08\u5728\u65B0\u6A19\u7C64\u4E2D\u6253\u958B\uFF09",
    "list": "\u5217\u8868",
    "ordered list": "\u6578\u5B57\u5217\u8868",
    "unordered list": "\u7121\u5E8F\u5217\u8868",
    "remove list": "\u522A\u9664\u5217\u8868",
    "image": "\u5716\u7247",
    "uploading": "\u4E0A\u50B3\u4E2D",
    "upload failed": "\u4E0A\u50B3\u5931\u6557",
    "drop or click to upload image": "\u62D6\u653E\u6216\u700F\u89BD\u6587\u4EF6\u4E0A\u50B3",
    "please select the appropriate file types:": "\u8ACB\u9078\u64C7\u9069\u7576\u7684\u6587\u4EF6\u985E\u578B\uFF1A",
    "max allowed size per file should be ": "\u55AE\u500B\u6587\u4EF6\u5141\u8A31\u7684\u6700\u5927\u5927\u5C0F\u61C9\u8A72\u662F ",
    "max allowed size of all files in total should be ": "\u7E3D\u6587\u4EF6\u7684\u6700\u5927\u5141\u8A31\u5927\u5C0F\u61C9\u70BA ",
    "UPLOADING...": "\u4E0A\u50B3\u4E2D...",
    "START OVER": "\u91CD\u65B0\u958B\u59CB"
  };

  // src/lang/index.ts
  var lang_default = {
    en: en_default,
    zhCN: zhCN_default,
    zhTW: zhTW_default
  };

  // src/toolbar/color.ts
  var rgbToHex = (r, g, b) => "#" + [r, g, b].map((x) => {
    if (x === "")
      return "00";
    const hex = parseInt(x, 10).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
  var rgbStyleToHex = (rgb) => {
    if (rgb.indexOf("rgb(") === -1)
      return rgb;
    let _rgb = rgb.replace("rgb(", "").replace(")", "").split(",");
    return rgbToHex(_rgb[0], _rgb[1], _rgb[2]);
  };
  function color_default(editor) {
    const content = (type) => {
      var _a, _b;
      const v = type === "color" ? ["color", SubEditor.svgList["text_color"], ((_a = editor.feature) == null ? void 0 : _a.color) || "", editor.ln("text color"), editor.ln("SET COLOR"), "#000000"] : ["background", SubEditor.svgList["background_color"], ((_b = editor.feature) == null ? void 0 : _b.background) || "", editor.ln("background color"), editor.ln("SET BACKGROUND COLOR"), "#ffffff"];
      return '<div class="se-ToolbarItem se-dropdown"><div class="se-dropdown-trigger"><button class="se-button"  data-command="' + v[0] + '" data-tips="' + v[3] + '" id="btn-dropdown-menu-' + v[0] + '" aria-haspopup="true" aria-controls="dropdown-menu-' + v[0] + '"><span></span><span class="se-icon">' + v[1] + '</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-' + v[0] + '" role="menu"><div class="se-dropdown-content control"><div class="padding"><table><tbody><tr><td><div style="background-color: rgb(0, 0, 0);"></div></td><td><div style="background-color: rgb(68, 68, 68);"></div></td><td><div style="background-color: rgb(102, 102, 102);"></div></td><td><div style="background-color: rgb(153, 153, 153);"></div></td><td><div style="background-color: rgb(204, 204, 204);"></div></td><td><div style="background-color: rgb(238, 238, 238);"></div></td><td><div style="background-color: rgb(243, 243, 243);"></div></td><td><div style="background-color: rgb(255, 255, 255);"></div></td></tr><tr><td><div style="background-color: rgb(255, 0, 0);"></div></td><td><div style="background-color: rgb(255, 153, 0);"></div></td><td><div style="background-color: rgb(255, 255, 0);"></div></td><td><div style="background-color: rgb(0, 255, 0);"></div></td><td><div style="background-color: rgb(0, 255, 255);"></div></td><td><div style="background-color: rgb(0, 0, 255);"></div></td><td><div style="background-color: rgb(153, 0, 255);"></div></td><td><div style="background-color: rgb(255, 0, 255);"></div></td></tr><tr><td><div style="background-color: rgb(244, 204, 204);"></div></td><td><div style="background-color: rgb(252, 229, 205);"></div></td><td><div style="background-color: rgb(255, 242, 204);"></div></td><td><div style="background-color: rgb(217, 234, 211);"></div></td><td><div style="background-color: rgb(208, 224, 227);"></div></td><td><div style="background-color: rgb(207, 226, 243);"></div></td><td><div style="background-color: rgb(217, 210, 233);"></div></td><td><div style="background-color: rgb(234, 209, 220);"></div></td></tr><tr><td><div style="background-color: rgb(234, 153, 153);"></div></td><td><div style="background-color: rgb(249, 203, 156);"></div></td><td><div style="background-color: rgb(255, 229, 153);"></div></td><td><div style="background-color: rgb(182, 215, 168);"></div></td><td><div style="background-color: rgb(162, 196, 201);"></div></td><td><div style="background-color: rgb(159, 197, 232);"></div></td><td><div style="background-color: rgb(180, 167, 214);"></div></td><td><div style="background-color: rgb(213, 166, 189);"></div></td></tr><tr><td><div style="background-color: rgb(224, 102, 102);"></div></td><td><div style="background-color: rgb(246, 178, 107);"></div></td><td><div style="background-color: rgb(255, 217, 102);"></div></td><td><div style="background-color: rgb(147, 196, 125);"></div></td><td><div style="background-color: rgb(118, 165, 175);"></div></td><td><div style="background-color: rgb(111, 168, 220);"></div></td><td><div style="background-color: rgb(142, 124, 195);"></div></td><td><div style="background-color: rgb(194, 123, 160);"></div></td></tr><tr><td><div style="background-color: rgb(204, 0, 0);"></div></td><td><div style="background-color: rgb(230, 145, 56);"></div></td><td><div style="background-color: rgb(241, 194, 50);"></div></td><td><div style="background-color: rgb(106, 168, 79);"></div></td><td><div style="background-color: rgb(69, 129, 142);"></div></td><td><div style="background-color: rgb(61, 133, 198);"></div></td><td><div style="background-color: rgb(103, 78, 167);"></div></td><td><div style="background-color: rgb(166, 77, 121);"></div></td></tr><tr><td><div style="background-color: rgb(153, 0, 0);"></div></td><td><div style="background-color: rgb(180, 95, 6);"></div></td><td><div style="background-color: rgb(191, 144, 0);"></div></td><td><div style="background-color: rgb(56, 118, 29);"></div></td><td><div style="background-color: rgb(19, 79, 92);"></div></td><td><div style="background-color: rgb(11, 83, 148);"></div></td><td><div style="background-color: rgb(53, 28, 117);"></div></td><td><div style="background-color: rgb(116, 27, 71);"></div></td></tr><tr><td><div style="background-color: rgb(102, 0, 0);"></div></td><td><div style="background-color: rgb(120, 63, 4);"></div></td><td><div style="background-color: rgb(127, 96, 0);"></div></td><td><div style="background-color: rgb(39, 78, 19);"></div></td><td><div style="background-color: rgb(12, 52, 61);"></div></td><td><div style="background-color: rgb(7, 55, 99);"></div></td><td><div style="background-color: rgb(32, 18, 77);"></div></td><td><div style="background-color: rgb(76, 17, 48);"></div></td></tr></tbody></table><div><input class="Hex" type="color" value="' + (rgbStyleToHex(v[2]) || v[5]) + '"><button class="se-button">' + v[4] + "</button></div></div></div></div></div>";
    };
    return {
      color: {
        command: "color",
        svg: SubEditor.svgList["text_color"],
        tips: editor.ln("text color"),
        dropdowncontent: content("color"),
        onRender: (_editor, el) => {
          var _a, _b;
          const menu = el.querySelector(".se-dropdown-menu");
          (_a = el.querySelector(".se-dropdown-trigger > button")) == null ? void 0 : _a.addEventListener("click", () => {
            var _a2, _b2, _c, _d, _e;
            if (!menu.classList.contains("is-active")) {
              _editor.handleFeature();
              el.querySelector("input").value = rgbStyleToHex(((_b2 = (_a2 = _editor.feature) == null ? void 0 : _a2.node) == null ? void 0 : _b2.style.color) || ((_e = (_d = (_c = _editor.feature) == null ? void 0 : _c.node) == null ? void 0 : _d.parentElement) == null ? void 0 : _e.style.color) || "");
            }
          });
          el.querySelectorAll("td > div").forEach((div) => {
            div.addEventListener("click", (e) => {
              el.querySelector("input").value = rgbStyleToHex(e.currentTarget.style.backgroundColor);
            });
          });
          (_b = el.querySelector(".se-dropdown-content button")) == null ? void 0 : _b.addEventListener("click", (e) => {
            var _a2, _b2;
            e.preventDefault();
            e.stopPropagation();
            (_a2 = _editor.toolbar) == null ? void 0 : _a2.hideDropdown();
            _editor.command("color", [(_b2 = el.querySelector("input")) == null ? void 0 : _b2.value]);
            return false;
          });
        }
      },
      backgroundcolor: {
        command: "backgroundcolor",
        svg: SubEditor.svgList["background_color"],
        tips: "background color",
        dropdowncontent: content("background"),
        onRender: (_editor, el) => {
          var _a, _b;
          const menu = el.querySelector(".se-dropdown-menu");
          (_a = el.querySelector(".se-dropdown-trigger > button")) == null ? void 0 : _a.addEventListener("click", () => {
            var _a2, _b2, _c, _d, _e;
            if (!menu.classList.contains("is-active")) {
              _editor.handleFeature();
              el.querySelector("input").value = rgbStyleToHex(((_b2 = (_a2 = _editor.feature) == null ? void 0 : _a2.node) == null ? void 0 : _b2.style.backgroundColor) || ((_e = (_d = (_c = _editor.feature) == null ? void 0 : _c.node) == null ? void 0 : _d.parentElement) == null ? void 0 : _e.style.backgroundColor) || "");
            }
          });
          el.querySelectorAll("td > div").forEach((div) => {
            div.addEventListener("click", (e) => {
              el.querySelector("input").value = rgbStyleToHex(e.currentTarget.style.backgroundColor);
            });
          });
          (_b = el.querySelector(".se-dropdown-content button")) == null ? void 0 : _b.addEventListener("click", (e) => {
            var _a2, _b2;
            e.preventDefault();
            e.stopPropagation();
            (_a2 = _editor.toolbar) == null ? void 0 : _a2.hideDropdown();
            _editor.command("backgroundcolor", [(_b2 = el.querySelector("input")) == null ? void 0 : _b2.value]);
            return false;
          });
        }
      }
    };
  }

  // src/toolbar/bold.ts
  function bold_default(editor) {
    return {
      bold: {
        command: "bold",
        svg: SubEditor.svgList["b"],
        tips: "bold"
      }
    };
  }

  // src/toolbar/underline.ts
  function underline_default(editor) {
    return {
      underline: {
        command: "underline",
        svg: SubEditor.svgList["u"],
        tips: "underline"
      }
    };
  }

  // src/toolbar/blockquote.ts
  function blockquote_default(editor) {
    return {
      blockquote: {
        command: "blockquote",
        svg: SubEditor.svgList["blockquote"],
        tips: "blockquote"
      }
    };
  }

  // src/toolbar/italic.ts
  function italic_default(editor) {
    return {
      italic: {
        command: "italic",
        svg: SubEditor.svgList["i"],
        tips: "italic"
      }
    };
  }

  // src/toolbar/format.ts
  function format_default(editor) {
    return {
      format: {
        command: "format",
        svg: SubEditor.svgList["p"],
        tips: "format",
        dropdowncontent: '<div class="se-ToolbarItem se-dropdown" data-tips="' + editor.ln("paragraph") + '"><div class="se-dropdown-trigger"><button class="se-button"  data-command="paragraph" data-tips="paragraph" id="btn-dropdown-menu-paragraph" aria-haspopup="true" aria-controls="dropdown-menu-paragraph"><span></span><span class="se-icon" aria-hidden="true">' + SubEditor.svgList["p"] + '</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-paragraph" role="menu"><div class="se-dropdown-content horizontal"  aria-hidden="true"><span class="se-button se-ToolbarItem" data-command="p" data-featureformat="P" data-tips="Normal"><span class="se-icon">' + SubEditor.svgList["p"] + '</span></span><span class="se-button se-ToolbarItem" data-command="h1" data-featureformat="H1" data-tips="Heading 1"><span class="se-icon">' + SubEditor.svgList["h1"] + '</span></span><span class="se-button se-ToolbarItem" data-command="h2" data-featureformat="H2" data-tips="Heading 2"><span class="se-icon">' + SubEditor.svgList["h2"] + '</span></span><span class="se-button se-ToolbarItem" data-command="h3" data-featureformat="H3" data-tips="Heading 3"><span class="se-icon">' + SubEditor.svgList["h3"] + '</span></span><span class="se-button se-ToolbarItem" data-command="h4" data-featureformat="H4" data-tips="Heading 4"><span class="se-icon">' + SubEditor.svgList["h4"] + '</span></span><span class="se-button se-ToolbarItem" data-command="h5" data-featureformat="H5" data-tips="Heading 5"><span class="se-icon">' + SubEditor.svgList["h5"] + '</span></span><span class="se-button se-ToolbarItem" data-command="h6" data-featureformat="H6" data-tips="Heading 6"><span class="se-icon">' + SubEditor.svgList["h6"] + '</span></span><span class="se-button se-ToolbarItem" data-command="blockquote" data-featureformat="BLOCKQUOTE" data-tips="Blockquote"><span class="se-icon">' + SubEditor.svgList["blockquote"] + '</span></span><span class="se-button se-ToolbarItem" data-command="code" data-featureformat="CODE" data-tips="Code"><span class="se-icon">' + SubEditor.svgList["code"] + "</span></span></div></div></div>",
        onRender: (_editor, el) => {
          el.querySelectorAll(".se-button").forEach((elm) => {
            elm.addEventListener("click", (e) => {
              const cmd = elm.getAttribute("data-command");
              _editor.command(cmd, []);
            });
          });
        }
      }
    };
  }

  // src/toolbar/fullscreen.ts
  function fullscreen_default(editor) {
    return {
      fullscreen: {
        command: "fullscreen",
        svg: SubEditor.svgList["fullscreen"],
        tips: "fullscreen",
        onRender: (_editor, el) => {
          el.setAttribute("data-value", "1");
          el.addEventListener("click", (e) => {
            _editor.command("fullscreen", [el.getAttribute("data-value")]);
          });
          _editor.event.register([{ event: "onFullscreenChange", target: [], callback: () => {
            const isFullscreen = el.getAttribute("data-value");
            if (isFullscreen === "") {
              el.querySelector("span.se-icon").innerHTML = SubEditor.svgList["fullscreen"];
              el.setAttribute("data-value", "1");
              el.setAttribute("data-tips", "exit fullscreen");
              el.classList.remove("is-featured");
            } else {
              el.querySelector("span.se-icon").innerHTML = SubEditor.svgList["fullscreen_close"];
              el.setAttribute("data-value", "");
              el.setAttribute("data-tips", "fullscreen");
              el.classList.add("is-featured");
            }
            if (editor.refToolbar) {
              const tips = editor.refToolbar.querySelector(".tips");
              if (tips) {
                tips.style.display = "none";
                tips.style.top = "";
              }
            }
          } }]);
        }
      }
    };
  }

  // src/toolbar/align.ts
  function align_default(editor) {
    return {
      align: {
        command: "align",
        svg: SubEditor.svgList["align_left"],
        tips: "align",
        dropdowncontent: '<div class="se-dropdown se-ToolbarItem" data-tips="' + editor.ln("align") + '"><div class="se-dropdown-trigger"><button class="se-button" aria-haspopup="true" aria-controls="dropdown-menu-align"><span></span><span class="se-icon">' + SubEditor.svgList["align_left"] + '</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-align" role="menu"><div class="se-dropdown-content horizontal"><span class="se-button se-ToolbarItem" data-command="align" data-value="left" data-tips="align left"><span class="se-icon">' + SubEditor.svgList["align_left"] + '</span></span><span class="se-button se-ToolbarItem" data-command="align" data-value="center" data-tips="align center"><span class="se-icon">' + SubEditor.svgList["align_center"] + '</span></span><span class="se-button se-ToolbarItem" data-command="align" data-value="right" data-tips="align right"><span class="se-icon">' + SubEditor.svgList["align_right"] + '</span></span><span class="se-button ToolbarItem" data-command="align" data-value="justify" data-tips="align justify"><span class="se-icon">' + SubEditor.svgList["align_justify"] + "</span></span></div></div></div>",
        onRender: (_editor, el) => {
          el.querySelectorAll(".se-button[data-command]").forEach((btn) => {
            btn.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              _editor.command("align", [btn.getAttribute("data-value")]);
              return false;
            });
          });
          _editor.event.register([{ event: "onFeatureChange", target: [], callback: () => {
            el.querySelectorAll(".se-button").forEach((btn) => {
              var _a;
              btn.classList.remove("is-featured");
              if (btn.getAttribute("data-value") === ((_a = _editor.feature) == null ? void 0 : _a.align)) {
                btn.classList.add("is-featured");
              }
            });
          } }]);
        }
      }
    };
  }

  // src/toolbar/table.ts
  function createTableDropdown(editor, el) {
    el.querySelector(".se-dropdown-content").innerHTML = '<div class="padding"><table class="ToolbarTable"><tbody><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table><div class="title"></div></div>';
    const table = el.querySelector("table");
    const _mouseover = (e, row, col2) => {
      let x = 0, y = 0;
      table.querySelectorAll("tr").forEach((tr) => {
        x++;
        tr.querySelectorAll("td").forEach((td) => {
          y++;
          td.classList.remove("active");
          if (row >= x && col2 >= y) {
            td.classList.add("active");
          }
          if (td === e.currentTarget) {
            el.querySelector(".title").innerHTML = x + " x " + y;
          }
        });
        y = 0;
      });
    };
    const _mouseout = () => {
      table.querySelectorAll("td").forEach((td) => {
        td.classList.remove("active");
        el.querySelector(".title").innerHTML = "&nbsp;";
      });
    };
    let _row = 0, _col = 0;
    table.querySelectorAll("tr").forEach((tr) => {
      _row++;
      tr.querySelectorAll("td").forEach((td) => {
        _col++;
        const __row = _row, __col = _col;
        td.addEventListener("mouseover", (e) => {
          _mouseover(e, __row, __col);
        });
        td.addEventListener("mouseout", _mouseout);
        td.addEventListener("click", () => {
          var _a;
          (_a = editor.toolbar) == null ? void 0 : _a.hideDropdown();
          editor.command("table", [__row + "," + __col]);
        });
      });
      _col = 0;
    });
  }
  function inTableDropdown(editor, el) {
    var _a, _b, _c, _d, _e;
    const cell = editor.dom.nodeParent((_a = editor.feature) == null ? void 0 : _a.node, "TD") || editor.dom.nodeParent((_b = editor.feature) == null ? void 0 : _b.node, "TH");
    const is_td = (_c = editor.feature) == null ? void 0 : _c.path.includes("TD"), table = editor.feature.pathNode[(_d = editor.feature) == null ? void 0 : _d.path.indexOf("TABLE")], tr = editor.dom.nodeParent((_e = editor.feature) == null ? void 0 : _e.node, "TR"), trs = table.querySelectorAll("tbody tr");
    const has_header = table.querySelectorAll("th").length > 0;
    const col2 = editor.dom.nodePosition(cell), row = editor.dom.nodePosition(tr);
    const noderowspan = parseInt(cell.getAttribute("rowspan") || "1", 10), nodecolspan = parseInt(cell.getAttribute("colspan") || "1", 10);
    const allow_unmerge = nodecolspan > 1 || noderowspan > 1;
    let allow_mergeright = cell.parentElement.childNodes.length > col2 + 1;
    let allow_mergedown = is_td && trs.length > row + 1;
    const tableCellList = allow_mergedown || allow_mergeright ? editor.dom.table.cellList(table, false) : [];
    if (allow_mergeright) {
      const nodeList = tableCellList[row], idx = nodeList.indexOf(cell);
      if (editor.dom.table.rowSpan(cell) !== editor.dom.table.rowSpan(nodeList[idx + 1])) {
        allow_mergeright = false;
      }
    }
    if (allow_mergedown) {
      const nodeList = tableCellList[row], nextNodeList = tableCellList[row + 1], idx = nodeList.indexOf(cell);
      if (editor.dom.table.colSpan(nodeList[idx]) !== editor.dom.table.colSpan(nextNodeList[idx])) {
        allow_mergedown = false;
      }
    }
    el.querySelector(".se-dropdown-content").innerHTML = '<button class="se-button se-dropdown-item hover borderbottom" data-command="table_style" >' + editor.ln("TABLE STYLE") + '</button><button class="se-button se-dropdown-item hover borderbottom" data-command="cell_style">' + editor.ln("CELL STYLE") + '</button><button class="se-button se-dropdown-item hover borderbottom" data-command="insert_header" style="' + (has_header ? "display: none;" : "") + '">' + editor.ln("INSERT HEADER") + '</button><button class="se-button se-dropdown-item hover borderbottom" data-command="delete_header" style="' + (is_td ? "display: none;" : "") + '">' + editor.ln("DELETE HEADER") + '</button><button class="se-button se-dropdown-item hover borderbottom" data-command="insert_row_above" style="' + (!is_td ? "display: none;" : "") + '">' + editor.ln("INSERT ROW ABOVE") + '</button><button class="se-button se-dropdown-item hover borderbottom" data-command="insert_row_below" style="' + (!is_td ? "display: none;" : "") + '">' + editor.ln("INSERT ROW BELOW") + '</button><button class="se-button se-dropdown-item hover borderbottom" data-command="insert_column_left">' + editor.ln("INSERT COLUMN LEFT") + '</button><button class="se-button se-dropdown-item hover borderbottom" data-command="insert_column_right">' + editor.ln("INSERT COLUMN RIGHT") + '</button><button class="se-button se-dropdown-item hover borderbottom" data-command="delete_row" style="' + (!is_td ? "display: none;" : "") + '">' + editor.ln("DELETE ROW") + '</button><button class="se-button se-dropdown-item hover borderbottom" data-command="delete_column">' + editor.ln("DELETE COLUMN") + '</button><button class="se-button se-dropdown-item hover borderbottom" data-command="merge_down" style="' + (!allow_mergedown ? "display: none;" : "") + '">' + editor.ln("MERGE DOWN") + '</button><button class="se-button se-dropdown-item hover borderbottom" data-command="merge_right" style="' + (!allow_mergeright ? "display: none;" : "") + '">' + editor.ln("MERGE RIGHT") + '</button><button class="se-button se-dropdown-item hover" data-command="unmerge" style="' + (!allow_unmerge ? "display: none;" : "") + '">' + editor.ln("UNMERGE") + "</button>";
    el.querySelectorAll(".se-dropdown-item").forEach((i) => {
      i.addEventListener("click", (e) => {
        var _a2;
        e.preventDefault();
        e.stopPropagation();
        const cmd = i.getAttribute("data-command") || "";
        if (cmd === "table_style") {
          const style = table.hasAttribute("style") ? table.getAttribute("style") : editor.getCfg("table.default.table.style");
          el.querySelector(".se-dropdown-content").innerHTML = '<div class="padding"><div class="se-dropdown-item"><input type="text" name="style"><label>' + editor.ln("TABLE STYLE") + '</label></div><div style="text-align: right;margin-right:5px"><button class="se-button apply">' + editor.ln("Apply") + "</button></div></div>";
          el.querySelector(".se-dropdown-content input[name=style]").value = style;
          el.querySelector(".se-dropdown-content .se-button.apply").addEventListener("click", (ev) => {
            var _a3;
            ev.preventDefault();
            ev.stopPropagation();
            editor.restoreSelection(editor.getCache("currentSelection"));
            editor.command("table", ["table_style", el.querySelector(".se-dropdown-content input[name=style]").value]);
            (_a3 = editor.toolbar) == null ? void 0 : _a3.hideDropdown();
            return false;
          });
          return false;
        }
        if (cmd === "cell_style") {
          const style = cell.hasAttribute("style") ? cell.getAttribute("style") : editor.getCfg(is_td ? "table.default.cell.style" : "table.default.header.cell.style");
          let str = '<div class="padding"><div class="se-dropdown-item"><input type="text" name="style"><label>' + editor.ln("CELL STYLE") + '</label></div><div style="text-align:right;display:flex"><button disabled style="    border: none;background: #fff;">' + editor.ln("Apply To") + "</button>";
          if (is_td) {
            str += '<button class="se-button apply" data-value="all">' + editor.ln("All") + '</button><button class="se-button apply" data-value="row">' + editor.ln("Row") + '</button><button class="se-button apply" data-value="cell">' + editor.ln("Cell") + "</button></div></div>";
          } else {
            str += '<button class="se-button apply" data-value="row">' + editor.ln("Row") + '</button><button class="se-button apply" data-value="cell">' + editor.ln("Cell") + "</button></div></div>";
          }
          el.querySelector(".se-dropdown-content").innerHTML = str;
          el.querySelector(".se-dropdown-content input[name=style]").value = style;
          Array.from(el.querySelectorAll(".se-dropdown-content .se-button.apply")).forEach((btn) => btn.addEventListener("click", (ev) => {
            var _a3;
            ev.preventDefault();
            ev.stopPropagation();
            editor.restoreSelection(editor.getCache("currentSelection"));
            editor.command("table", ["cell_style", el.querySelector(".se-dropdown-content input[name=style]").value, ev.target.getAttribute("data-value") || ""]);
            (_a3 = editor.toolbar) == null ? void 0 : _a3.hideDropdown();
            return false;
          }));
          return false;
        }
        editor.restoreSelection(editor.getCache("currentSelection"));
        editor.command("table", [cmd]);
        (_a2 = editor.toolbar) == null ? void 0 : _a2.hideDropdown();
        return false;
      });
    });
  }
  function table_default2(editor) {
    return {
      table: {
        command: "table",
        svg: SubEditor.svgList["table"],
        tips: editor.ln("table"),
        dropdowncontent: '<div class="se-dropdown se-ToolbarItem" data-tips="' + editor.ln("table") + '"><div class="se-dropdown-trigger"><button class="se-button" aria-haspopup="true" aria-controls="dropdown-menu-table"><span></span><span class="se-icon">' + SubEditor.svgList["table"] + '</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-table" role="menu"><div class="se-dropdown-content se-control"><div class="title"></div></div></div></div>',
        onRender: (_editor, table) => {
          const menu = table.querySelector(".se-dropdown-menu");
          table.querySelector(".se-dropdown-trigger > button").addEventListener("click", () => {
            var _a;
            if (!menu.classList.contains("is-active")) {
              editor.setCache("currentSelection", _editor.selection);
              _editor.handleFeature();
              const path = (_a = _editor.feature) == null ? void 0 : _a.path;
              if (path.includes("TD") || path.includes("TH")) {
                inTableDropdown(_editor, table);
              } else {
                createTableDropdown(_editor, table);
              }
            }
          });
        }
      }
    };
  }

  // src/toolbar/hr.ts
  function hr_default(editor) {
    return {
      hr: {
        command: "hr",
        svg: SubEditor.svgList["hr"],
        tips: "horizontal line"
      }
    };
  }

  // src/toolbar/source.ts
  function source_default(editor) {
    return {
      source: {
        command: "source",
        svg: SubEditor.svgList["view_source"],
        tips: "view source",
        onRender: (_editor, el) => {
          el.addEventListener("click", () => {
            var _a;
            if (!((_a = _editor.toolbar) == null ? void 0 : _a.hasShadow())) {
              _editor.toolbar.enableShadow(["source", "fullscreen"]);
            } else {
              _editor.toolbar.disableShadow();
            }
            const cmd = el.getAttribute("data-command");
            _editor.command(cmd, []);
          });
        }
      }
    };
  }

  // src/toolbar/text.ts
  function text_default(editor) {
    return {
      text: {
        command: "text",
        svg: SubEditor.svgList["text"],
        tips: "text",
        dropdowncontent: '<div class="se-dropdown se-ToolbarItem" data-tips="text"><div class="se-dropdown-trigger"><button class="se-button" aria-haspopup="true" aria-controls="dropdown-menu-align"><span></span><span class="se-icon">' + SubEditor.svgList["text"] + '</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-align" role="menu"><div class="se-dropdown-content horizontal"><span class="se-button se-ToolbarItem" data-command="bold" data-tips="bold"><span class="se-icon">' + SubEditor.svgList["b"] + '</span></span><span class="se-button se-ToolbarItem" data-command="italic" data-tips="italic"><span class="se-icon">' + SubEditor.svgList["i"] + '</span></span><span class="se-button se-ToolbarItem" data-command="underline" data-tips="underline"><span class="se-icon">' + SubEditor.svgList["u"] + '</span></span><span class="se-button se-ToolbarItem" data-command="strikethrough" data-tips="strikethrough"><span class="se-icon">' + SubEditor.svgList["strikethrough"] + '</span></span><span class="se-button se-ToolbarItem" data-command="superscript" data-tips="superscript"><span class="se-icon">' + SubEditor.svgList["superscript"] + '</span></span><span class="se-button se-ToolbarItem" data-command="subscript" data-tips="subscript"><span class="se-icon">' + SubEditor.svgList["subscript"] + "</span></span></div></div></div>",
        onRender: (_editor, el) => {
          el.querySelectorAll(".se-button[data-command]").forEach((btn) => {
            btn.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("text", btn.getAttribute("data-command"));
              _editor.command(btn.getAttribute("data-command"));
              return false;
            });
          });
          _editor.event.register([{ event: "onFeatureChange", target: [], callback: () => {
            el.querySelectorAll(".se-button[data-command]").forEach((btn) => {
              btn.classList.remove("is-featured");
              const cmd = btn.getAttribute("data-command");
              if (_editor.feature[cmd]) {
                btn.classList.add("is-featured");
              }
            });
          } }]);
        }
      }
    };
  }

  // src/toolbar/undo.ts
  function undo_default(editor) {
    return {
      undo: {
        command: "undo",
        svg: SubEditor.svgList["undo"],
        tips: "undo"
      }
    };
  }

  // src/toolbar/redo.ts
  function redo_default(editor) {
    return {
      redo: {
        command: "redo",
        svg: SubEditor.svgList["redo"],
        tips: "redo"
      }
    };
  }

  // src/toolbar/indent.ts
  function indent_default(editor) {
    return {
      indent: {
        command: "indent",
        svg: SubEditor.svgList["indent"],
        tips: "indent"
      },
      outdent: {
        command: "outdent",
        svg: SubEditor.svgList["outdent"],
        tips: "outdent"
      }
    };
  }

  // src/toolbar/remove_format.ts
  function remove_format_default(editor) {
    return {
      remove_format: {
        command: "remove_format",
        svg: SubEditor.svgList["remove_format"],
        tips: "remove format"
      }
    };
  }

  // src/toolbar/link.ts
  function link_default(editor) {
    return {
      link: {
        command: "link",
        svg: SubEditor.svgList["link"],
        tips: "link",
        dropdowncontent: '<div class="se-dropdown se-ToolbarItem" data-tips="' + editor.ln("link") + '"><div class="se-dropdown-trigger"><button class="se-button" aria-haspopup="true" aria-controls="dropdown-menu-link"><span></span><span class="se-icon">' + SubEditor.svgList["link"] + '</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-link" role="menu"><div class="se-dropdown-content control"><div class="padding"><div class="se-dropdown-item"><input type="text" name="url"><label>' + editor.ln("url") + '</label></div><div class="se-dropdown-item"><input type="text" name="text"><label>' + editor.ln("text") + '</label></div><div class="se-dropdown-item"><input type="text" name="target"><label>' + editor.ln("link target") + ' <u style="cursor:pointer">' + editor.ln("open in new tab") + '</u></label></div><div style="text-align: right;margin-right:5px"><button class="se-button alert">' + editor.ln("remove") + '</button><button class="se-button insert">' + editor.ln("insert") + "</button></div></div></div></div></div>",
        onRender: (_editor, el) => {
          var _a, _b;
          const btnAlert = el.querySelector(".se-dropdown-content .se-button.alert"), btnInsert = el.querySelector(".se-dropdown-content .se-button.insert"), inputURL = el.querySelector(".se-dropdown-content input[name=url]"), inputText = el.querySelector(".se-dropdown-content input[name=text]"), inputTarget = el.querySelector(".se-dropdown-content input[name=target]");
          editor.setCache("currentSelection", _editor.selection);
          (_a = el.querySelector("u")) == null ? void 0 : _a.addEventListener("click", () => {
            el.querySelector("input[name=target]").value = "_blank";
          });
          btnInsert.addEventListener("click", (e) => {
            var _a2;
            e.preventDefault();
            e.stopPropagation();
            (_a2 = _editor.toolbar) == null ? void 0 : _a2.hideDropdown();
            _editor.restoreSelection(editor.getCache("currentSelection"));
            _editor.command("link", [btnInsert.innerHTML === editor.ln("insert") ? "insert" : "update", inputURL.value, inputText.value, inputTarget.value]);
            return false;
          });
          btnAlert.addEventListener("click", (e) => {
            var _a2;
            e.preventDefault();
            e.stopPropagation();
            (_a2 = _editor.toolbar) == null ? void 0 : _a2.hideDropdown();
            _editor.command("link", ["remove"]);
            return false;
          });
          const menu = el.querySelector(".se-dropdown-menu");
          (_b = el.querySelector(".se-dropdown-trigger > button")) == null ? void 0 : _b.addEventListener("click", () => {
            var _a2, _b2, _c, _d, _e;
            if (!menu.classList.contains("is-active")) {
              editor.setCache("currentSelection", _editor.selection);
              if ((_a2 = _editor.feature) == null ? void 0 : _a2.a.node) {
                btnInsert.innerHTML = editor.ln("update");
                inputURL.value = ((_b2 = _editor.feature) == null ? void 0 : _b2.a.href) || "";
                inputTarget.value = ((_c = _editor.feature) == null ? void 0 : _c.a.target) || "";
                inputText.value = ((_e = (_d = _editor.feature) == null ? void 0 : _d.a.node) == null ? void 0 : _e.textContent) || "";
                btnAlert.style.display = "";
              } else {
                inputURL.value = "";
                inputTarget.value = "";
                inputText.value = "";
                btnInsert.innerHTML = editor.ln("insert");
                btnAlert.style.display = "none";
              }
            }
          });
        }
      }
    };
  }

  // src/toolbar/remove_link.ts
  function remove_link_default(editor) {
    return {
      remove_link: {
        command: "remove_link",
        svg: SubEditor.svgList["remove_link"],
        tips: "remove link"
      }
    };
  }

  // src/toolbar/list.ts
  function list_default(editor) {
    return {
      ol: {
        command: "ol",
        svg: SubEditor.svgList["ol"],
        tips: "ordered list",
        onRender: (_editor, el) => {
          el.addEventListener("click", (e) => {
            const cmd = el.getAttribute("data-command");
            _editor.command(cmd, []);
          });
          _editor.event.register([{ event: "onFeatureChange", target: [], callback: () => {
            el.querySelectorAll(".se-button").forEach((btn) => {
              var _a;
              btn.classList.remove("is-featured");
              if ((_a = _editor.feature) == null ? void 0 : _a.path.includes("OL")) {
                btn.classList.add("is-featured");
              }
            });
          } }]);
        }
      },
      ul: {
        command: "ul",
        svg: SubEditor.svgList["ul"],
        tips: "unordered list",
        onRender: (_editor, el) => {
          el.addEventListener("click", (e) => {
            const cmd = el.getAttribute("data-command");
            _editor.command(cmd, []);
          });
          _editor.event.register([{ event: "onFeatureChange", target: [], callback: () => {
            el.querySelectorAll(".se-button").forEach((btn) => {
              var _a;
              btn.classList.remove("is-featured");
              if ((_a = _editor.feature) == null ? void 0 : _a.path.includes("UL")) {
                btn.classList.add("is-featured");
              }
            });
          } }]);
        }
      }
    };
  }

  // src/toolbar/toolbar.ts
  function ToolbarPresets(editor) {
    return Object.assign({}, undo_default(editor), redo_default(editor), color_default(editor), bold_default(editor), underline_default(editor), blockquote_default(editor), italic_default(editor), format_default(editor), fullscreen_default(editor), align_default(editor), table_default2(editor), hr_default(editor), source_default(editor), text_default(editor), indent_default(editor), remove_format_default(editor), link_default(editor), remove_link_default(editor), list_default(editor));
  }
  var _Toolbar = class {
    constructor(editor) {
      this.refToolbar = document.createElement("div");
      this.refShadow = document.createElement("div");
      this.refTips = document.createElement("div");
      this.pluginItemList = {};
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
    addItem(item) {
      let barItem = void 0;
      const presets = ToolbarPresets(this.editor);
      if (typeof item === "string") {
        if (typeof _Toolbar.presetItemList[item] === "function")
          barItem = _Toolbar.presetItemList[item](this.editor);
        else if (typeof this.pluginItemList[item] !== "undefined")
          barItem = this.pluginItemList[item];
        else if (typeof presets[item] !== "undefined")
          barItem = presets[item];
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
        this.refToolbar.querySelectorAll("div[data-command]").forEach((el) => {
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
        ddcontent.setAttribute("style", "transform:translateX(-" + xNew + "px)");
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

  // src/plugins/fullscreen.ts
  var fullscreen_default2 = [{
    event: "onCommand",
    target: ["fullscreen"],
    callback: (editor, type, value) => {
      if (value) {
        editor.refEditor.setAttribute("data-backupstyle", editor.refEditor.getAttribute("style") || "");
        editor.refEditor.setAttribute("style", "position:fixed;z-index:100500;height:100%;width:100%;top:0;left:0;");
      } else {
        editor.refEditor.setAttribute("style", editor.refEditor.getAttribute("data-backupstyle") || "");
      }
      editor.event.trigger("onFullscreenChange", "", [editor, value]);
      return false;
    }
  }];

  // src/plugins/hr.ts
  var hr_default2 = [{
    event: "onCommand",
    target: ["hr"],
    callback: (editor, cmd, value) => {
      var _a, _b, _c, _d, _e;
      const { range } = editor.getSelectionRange();
      const node = document.createElement("hr");
      if (range.endContainer.parentElement.nodeName === "CODE") {
        let el = range.endContainer.parentElement;
        if (el.parentElement.nodeName === "PRE")
          el = el.parentElement;
        editor.dom.nodesInsertAfter([node], el);
        editor.triggerChange();
        return;
      }
      range.deleteContents();
      range.insertNode(node);
      if (node.parentElement.childNodes.length > 1 && node === node.parentElement.childNodes[node.parentElement.childNodes.length - 2] && ((_a = node.nextSibling) == null ? void 0 : _a.nodeType) === Node.TEXT_NODE && ((_b = node.nextSibling) == null ? void 0 : _b.textContent) === "") {
        node.nextSibling.remove();
      }
      const usableParent3 = (node2) => {
        const path = [];
        path.push(node2);
        while (editor.dom.nodeIsTextInlineOrVoid(node2) && node2 !== editor.refContent && ["DIV", "TD", "TH", "LI"].indexOf(node2.nodeName) === -1) {
          node2 = node2.parentNode;
          path.push(node2);
        }
        return path;
      };
      const nodePath = usableParent3(node);
      const pNode = nodePath.find((n) => n.nodeName === "P");
      if (pNode) {
        if (((_c = node.parentElement) == null ? void 0 : _c.nodeName) !== "P") {
          editor.dom.nodeBreak(pNode, node);
        }
        const hrs = Array.from(node.parentElement.querySelectorAll("hr"));
        let i = hrs.length - 1;
        if (!hrs[i].nextSibling) {
          editor.dom.nodesInsertAfter([hrs[i]], node.parentElement);
          i--;
        }
        for (; i >= 0; i--) {
          const p = document.createElement("p");
          let n = hrs[i].nextSibling, children = [];
          while (n) {
            children.push(n);
            n = n.nextSibling;
          }
          children.forEach((c) => p.appendChild(c));
          editor.dom.nodesInsertAfter([hrs[i], p], node.parentElement);
        }
      }
      range.setEndAfter(node);
      range.collapse(false);
      if (editor.refContent.lastChild === node) {
        if (((_e = (_d = editor.refContent.lastElementChild) == null ? void 0 : _d.previousElementSibling) == null ? void 0 : _e.nodeName) === "P") {
          const p = document.createElement("p");
          p.appendChild(document.createElement("br"));
          editor.refContent.appendChild(p);
          range.setEndBefore(p.childNodes[0]);
          range.collapse(false);
        } else {
          editor.refContent.appendChild(document.createElement("br"));
          range.setEndAfter(editor.refContent.lastChild);
          range.collapse(false);
        }
      }
      editor.triggerChange();
    }
  }];

  // src/plugins/color.ts
  var color_default2 = [
    {
      event: "onCommand",
      target: ["color", "backgroundcolor"],
      callback: (editor, cmd, value) => {
        const attr = cmd === "color" ? "color" : "background-color";
        const { range } = editor.getSelectionRange();
        const nodes = editor.dom.selectDeepNodesInRange(range);
        if (nodes[0].collapsed && nodes[0].node.parentElement) {
          if (nodes[0].node === editor.refContent) {
            const placeholder = document.createElement("span");
            placeholder.setAttribute("style", attr + ":" + value);
            placeholder.appendChild(document.createElement("br"));
            editor.refContent.appendChild(placeholder);
            range.selectNode(placeholder);
            range.collapse(true);
          } else if (editor.dom.nodeIsTextOrVoid(nodes[0].node) && (nodes[0].node.parentElement === editor.refContent || nodes[0].node.parentElement.nodeName === "DIV" || nodes[0].node.parentElement.childNodes.length > 1)) {
            const placeholder = document.createElement("span");
            placeholder.setAttribute("style", attr + ":" + value);
            editor.dom.wrapNode(nodes[0].node, placeholder);
            editor.dom.setCaretAt(nodes[0].node, nodes[0].startOffset);
          } else if (!editor.dom.nodeIsTextOrVoid(nodes[0].node)) {
            editor.dom.nodeReplaceAttrStyle(nodes[0].node, attr, value);
          } else {
            editor.dom.nodeReplaceAttrStyle(nodes[0].node.parentElement, attr, value);
          }
          editor.triggerChange();
          return;
        }
        nodes.forEach((node) => {
          var _a, _b;
          if (node.isVoid) {
            if (node === nodes[nodes.length - 1]) {
              editor.dom.setCaretAt(node.node, 1);
            }
            return;
          }
          if (node.partial) {
            const str = node.node.textContent.substring(node.startOffset, node.endOffset);
            const span = document.createElement("span");
            span.appendChild(document.createTextNode(str));
            span.setAttribute("style", attr + ":" + value);
            if (nodes.length === 1) {
              range.deleteContents();
              range.insertNode(span);
              editor.dom.setCaretAt(span.childNodes[0], (_a = span.childNodes[0].textContent) == null ? void 0 : _a.length);
            } else if (node === nodes[0]) {
              editor.dom.nodesInsertAfter([span], node.node);
              node.node.textContent = node.node.textContent.substring(0, node.startOffset);
            } else {
              (_b = node.node.parentElement) == null ? void 0 : _b.insertBefore(span, node.node);
              node.node.textContent = node.node.textContent.substring(node.endOffset);
              editor.dom.setCaretAt(nodes[nodes.length - 1].node, nodes[nodes.length - 1].endOffset);
            }
          } else {
            editor.dom.nodeReplaceAttrStyle(node.node.parentElement, attr, value);
            if (node === nodes[nodes.length - 1]) {
              editor.dom.setCaretAt(range.endContainer, range.endOffset);
            }
          }
        });
        editor.dom.mergeTags(range.commonAncestorContainer, "span");
        editor.triggerChange();
      }
    }
  ];

  // src/plugins/source.ts
  var source_default2 = [{
    event: "onCommand",
    target: ["source"],
    callback: (editor, type, value) => {
      const mode = editor.refContent.style.display === "none" ? "source" : "editor";
      if (mode === "editor") {
        editor.refContent.style.display = "none";
        const source = document.createElement("textarea");
        source.classList.add("SubEditorSource");
        source.value = editor.refContent.innerHTML;
        source.addEventListener("input", () => source.style.height = source.scrollHeight + "px");
        editor.refContent.parentElement.appendChild(source);
      } else {
        editor.refContent.style.display = "";
        const source = editor.refEditor.querySelector(".SubEditorSource");
        editor.changeValue(source.value);
        source.remove();
      }
    }
  }];

  // src/plugins/align.ts
  var align_default2 = [{
    event: "onCommand",
    target: ["align"],
    callback: (editor, cmd, value) => {
      const attr = "text-align";
      const { range } = editor.getSelectionRange();
      const nodes = editor.dom.selectDeepNodesInRange(range);
      if (nodes[0].collapsed && nodes[0].node.parentElement) {
        if (nodes[0].node === editor.refContent) {
          const placeholder = document.createElement("p");
          placeholder.setAttribute("style", attr + ":" + value);
          placeholder.appendChild(document.createElement("br"));
          editor.refContent.appendChild(placeholder);
          range.selectNode(placeholder);
          range.collapse(false);
        } else if (nodes[0].node.nodeType === Node.TEXT_NODE && nodes[0].node.parentElement === editor.refContent) {
          const placeholder = document.createElement("p");
          placeholder.setAttribute("style", attr + ":" + value);
          editor.dom.wrapNode(nodes[0].node, placeholder);
          editor.dom.setCaretAt(nodes[0].node, nodes[0].startOffset);
        } else {
          editor.dom.nodeReplaceAttrStyle(nodes[0].node.parentElement, attr, value);
        }
        editor.triggerChange();
        return;
      }
      let lastPlaceholdler = null;
      nodes.forEach((node) => {
        if (node.node.parentElement === editor.refContent) {
          if (lastPlaceholdler === null || lastPlaceholdler !== node.node.previousSibling) {
            lastPlaceholdler = document.createElement("p");
            lastPlaceholdler.setAttribute("style", attr + ":" + value);
            editor.dom.wrapNode(node.node, lastPlaceholdler);
          } else {
            lastPlaceholdler.appendChild(node.node);
          }
        } else {
          editor.dom.nodeReplaceAttrStyle(node.node.parentElement, attr, value);
        }
      });
      if (nodes[nodes.length - 1].isVoid) {
        editor.dom.setCaretAt(nodes[nodes.length - 1].node, 1);
      } else {
        editor.dom.setCaretAt(range.endContainer, range.endOffset);
      }
      editor.triggerChange();
    }
  }];

  // src/plugins/text.ts
  var tags = { "bold": "strong", "italic": "em", "underline": "u", "strikethrough": "strike", "subscript": "sub", "superscript": "sup" };
  var tag_values = Object.values(tags);
  tag_values.push("i");
  var isText = (t) => tag_values.indexOf(t.toLowerCase()) !== -1;
  var isInText = (n, matchNodeName) => {
    do {
      if (n.nodeName.toLowerCase() === matchNodeName || matchNodeName === "em" && n.nodeName === "I") {
        return n;
      }
      n = n.parentElement;
    } while (n && isText(n.nodeName));
    return false;
  };
  var text_default2 = [
    {
      event: "onCommand",
      target: ["bold", "italic", "underline", "strikethrough", "subscript", "superscript"],
      callback: (editor, type) => {
        const tag = tags[type];
        const { range } = editor.getSelectionRange();
        let caretNode = range.endContainer, caretOffset = range.endOffset;
        const nodes = editor.dom.selectDeepNodesInRange(range);
        const firstTextNode = nodes.find((n) => n.node.nodeType === Node.TEXT_NODE);
        const needWrap = !firstTextNode || !isInText(firstTextNode.node, tag);
        const formatNode = (n) => {
          const placeholder = document.createElement(tag);
          const parentNode = isInText(n.node, tag);
          if (needWrap && !parentNode) {
            editor.dom.wrapNode(n.node, placeholder);
          } else if (!needWrap && parentNode) {
            editor.dom.unwrapNode(parentNode, editor.refContent);
          }
        };
        caretNode = nodes[nodes.length - 1].node;
        caretOffset = nodes[nodes.length - 1].endOffset;
        const resetCaret = () => {
          editor.dom.setCaretAt(caretNode, caretOffset);
          editor.triggerChange();
        };
        if (nodes[0].collapsed) {
          if (nodes[0].node === editor.refContent) {
            const placeholder = document.createElement(tag);
            editor.refContent.appendChild(placeholder);
            placeholder.appendChild(document.createElement("br"));
            range.selectNode(placeholder);
            range.collapse(true);
            editor.triggerChange();
            return;
          }
          if (nodes[0].node.nodeType === Node.TEXT_NODE && nodes[0].node.parentElement)
            formatNode(nodes[0]);
          editor.dom.mergeTags(range.commonAncestorContainer, tag);
          return resetCaret();
        }
        nodes.forEach((node) => {
          var _a, _b;
          if (node.isVoid) {
            return;
          }
          if (!node.partial) {
            formatNode(node);
            return;
          }
          const parentNode = isInText(node.node, tag);
          if (needWrap && !parentNode) {
            const str = node.startOffset !== void 0 && node.startOffset > -1 ? node.node.textContent.substring(node.startOffset, node.endOffset) : node.node.textContent;
            const span = document.createElement(tag);
            span.appendChild(document.createTextNode(str));
            if (nodes.length === 1) {
              range.deleteContents();
              range.insertNode(span);
              editor.dom.setCaretAt(span.childNodes[0], (_a = span.childNodes[0].textContent) == null ? void 0 : _a.length);
            } else if (node === nodes[0]) {
              editor.dom.nodesInsertAfter([span], node.node);
              node.node.textContent = node.node.textContent.substring(0, node.startOffset);
            } else if (node === nodes[nodes.length - 1]) {
              (_b = node.node.parentElement) == null ? void 0 : _b.insertBefore(span, node.node);
              node.node.textContent = node.node.textContent.substring(node.endOffset);
            }
          } else if (!needWrap && parentNode) {
            editor.dom.unwrapNode(parentNode, editor.refContent);
          }
        });
        editor.dom.mergeTags(range.commonAncestorContainer, tag);
        resetCaret();
      }
    }
  ];

  // src/hotkey.ts
  var import_is_hotkey2 = __toModule(require_lib());
  var hotkey_default = {
    isBoldHotkey: (0, import_is_hotkey2.isKeyHotkey)("mod+b"),
    isItalicHotkey: (0, import_is_hotkey2.isKeyHotkey)("mod+i"),
    isUnderlinedHotkey: (0, import_is_hotkey2.isKeyHotkey)("mod+u"),
    isCodeHotkey: (0, import_is_hotkey2.isKeyHotkey)("mod+`"),
    isSaveHotKey: (0, import_is_hotkey2.isKeyHotkey)("mod+s"),
    isUndoHotKey: (0, import_is_hotkey2.isKeyHotkey)("mod+z"),
    isRedoHotKey: (0, import_is_hotkey2.isKeyHotkey)("mod+y"),
    isCopyHotKey: (0, import_is_hotkey2.isKeyHotkey)("mod+c"),
    isPasteHotKey: (0, import_is_hotkey2.isKeyHotkey)("mod+v"),
    isBackspace: (0, import_is_hotkey2.isKeyHotkey)("backspace"),
    isArrowLeft: (0, import_is_hotkey2.isKeyHotkey)("arrowleft"),
    isEnter: (0, import_is_hotkey2.isKeyHotkey)("enter"),
    isTab: (0, import_is_hotkey2.isKeyHotkey)("tab")
  };

  // src/plugins/undo.ts
  var undo_default2 = [
    {
      event: "onCommand",
      target: ["undo"],
      callback: (editor, cmd, value) => {
        editor.handleChange(editor.history.Undo());
      }
    },
    {
      event: "onKeyDown",
      target: ["mod+z"],
      callback: (editor, e) => {
        if (!hotkey_default.isUndoHotKey(e))
          return;
        e.preventDefault();
        e.stopPropagation();
        editor.handleChange(editor.history.Undo());
        return false;
      }
    }
  ];

  // src/plugins/redo.ts
  var redo_default2 = [
    {
      event: "onCommand",
      target: ["redo"],
      callback: (editor, cmd, value) => {
        editor.handleChange(editor.history.Redo());
      }
    },
    {
      event: "onKeyDown",
      target: ["mod+y", "cmd+shift+z"],
      callback: (editor, e) => {
        if (!hotkey_default.isRedoHotKey(e))
          return;
        e.preventDefault();
        e.stopPropagation();
        editor.handleChange(editor.history.Redo());
        return false;
      }
    }
  ];

  // src/plugins/indent.ts
  var indent_default2 = [{
    event: "onCommand",
    target: ["indent", "outdent"],
    callback: (editor, cmd, value) => {
      const attr = "padding-left";
      const size = cmd === "indent" ? parseInt("" + editor.getCfg("indent.size"), 10) || 40 : 0 - (parseInt("" + editor.getCfg("indent.size"), 10) || 40);
      const paddingLeft = (node, size2) => {
        let padding = (parseInt(editor.dom.nodeAttrStyle(node, attr), 10) || 0) + size2;
        if (padding < 0 && cmd !== "indent")
          return;
        if (padding === 0) {
          node.style.paddingLeft = "";
        } else
          node.style.paddingLeft = padding + "px";
      };
      const usableParent3 = (node) => {
        const path = [];
        path.push(node);
        while (editor.dom.nodeIsTextInlineOrVoid(node)) {
          node = node.parentNode;
          path.push(node);
        }
        return path;
      };
      const { range } = editor.getSelectionRange();
      const nodes = editor.dom.selectDeepNodesInRange(range);
      if (nodes[0].collapsed) {
        const parent = usableParent3(nodes[0].node);
        if (nodes[0].node === editor.refContent) {
          const placeholder = document.createElement("p");
          paddingLeft(placeholder, size);
          placeholder.appendChild(document.createElement("br"));
          editor.refContent.appendChild(placeholder);
          editor.dom.setCaretAt(placeholder, 0);
        } else if (editor.dom.nodesAreTextInlineOrVoid(Array.from(parent[0].childNodes))) {
          if (parent[parent.length - 1] !== editor.refContent) {
            paddingLeft(parent[parent.length - 1], size);
          } else {
            const placeholder = document.createElement("p");
            paddingLeft(placeholder, size);
            Array.from(parent[parent.length - 1].childNodes).forEach((el) => placeholder.appendChild(el));
            parent[parent.length - 1].appendChild(placeholder);
            editor.dom.setCaretAt(nodes[0].node, nodes[0].startOffset);
          }
        } else if (parent[parent.length - 1] === editor.refContent) {
          const placeholder = document.createElement("p");
          paddingLeft(parent[parent.length - 1], size);
          editor.dom.wrapNode(parent[parent.length - 2], placeholder);
          editor.dom.setCaretAt(nodes[0].node, nodes[0].startOffset);
        } else {
          paddingLeft(parent[parent.length - 1], size);
        }
        editor.triggerChange();
        return;
      }
      let lastPlaceholdler = null, padded = [], reducedNodes = [];
      if (nodes.length > 3) {
        reducedNodes = editor.dom.selectNodesBetweenRange(range);
        reducedNodes.unshift(nodes[0].node);
        reducedNodes.push(nodes[nodes.length - 1].node);
      } else {
        nodes.forEach((n) => reducedNodes.push(n.node));
      }
      reducedNodes.forEach((node) => {
        for (var i = 0, l = padded.length; i < l; i++) {
          if (padded[i].contains(node))
            return;
        }
        const parent2 = usableParent3(node);
        if (parent2[parent2.length - 1] === editor.refContent) {
          if (lastPlaceholdler === null || lastPlaceholdler !== node.previousSibling) {
            lastPlaceholdler = document.createElement("p");
            paddingLeft(lastPlaceholdler, size);
            editor.dom.wrapNode(parent2[parent2.length - 2], lastPlaceholdler);
          } else {
            lastPlaceholdler.appendChild(parent2[parent2.length - 2]);
          }
        } else {
          paddingLeft(parent2[parent2.length - 1], size);
        }
      });
      if (nodes[nodes.length - 1].isVoid) {
        editor.dom.setCaretAt(nodes[nodes.length - 1].node, 1);
      } else {
        editor.dom.setCaretAt(range.endContainer, range.endOffset);
      }
      editor.triggerChange();
    }
  }];

  // src/plugins/format.ts
  var clonePath = (paths, content = null) => {
    if (paths[paths.length - 1].nodeType === Node.TEXT_NODE) {
      return document.createTextNode(content ? content : paths[paths.length - 1].textContent);
    }
    const el = document.createElement(paths[paths.length - 1].nodeName);
    for (let i = paths.length - 2; i >= 0; i--) {
      if (paths[i].nodeType === Node.TEXT_NODE) {
        el.appendChild(document.createTextNode(content ? content : paths[paths.length - 1].textContent));
      } else
        el.appendChild(document.createElement(paths[i].nodeName));
    }
    return el;
  };
  var replaceNode = (node, tag) => {
    const n = document.createElement(tag);
    Array.from(node.childNodes).forEach((c) => n.appendChild(c));
    node.replaceWith(n);
  };
  var usableParent = (node, editor) => {
    const path = [];
    do {
      path.push(node);
      node = node.parentNode;
    } while (editor.dom.nodeIsTextInlineOrVoid(node) && node.nodeName !== "SPAN");
    return path;
  };
  var formatAction = (n, matchNodeName) => {
    const path = [], path_nodes = [], stopTags = ["TD", "P", "DIV", "LI", "CODE"];
    let path_node = n;
    while (path_node && stopTags.indexOf(path_node.nodeName) === -1) {
      path.push(path_node.nodeName);
      path_nodes.push(path_node);
      path_node = path_node.parentElement;
    }
    let action = "wrap";
    if (path.indexOf(matchNodeName) !== -1) {
      action = "unwrap";
      path_node = path_nodes[path.indexOf(matchNodeName)];
    } else if (path.indexOf(matchNodeName) === -1) {
      for (var i = 0, j = path.length; i < j; i++) {
        if (["H1", "H2", "H3", "H4", "H5", "H6"].indexOf(path[i]) !== -1) {
          action = "replace";
          path_node = path_nodes[i];
          break;
        }
      }
    }
    return { action, node: action === "wrap" ? null : path_node };
  };
  var format_default2 = [
    {
      event: "onKeyDown",
      target: ["enter"],
      callback: (editor, e) => {
        var _a, _b, _c;
        if (!((_a = editor.feature) == null ? void 0 : _a.path.includes("BLOCKQUOTE")))
          return;
        const { range } = editor.getSelectionRange();
        range.deleteContents();
        range.collapse(false);
        const nodes = editor.dom.selectDeepNodesInRange(range);
        const end = nodes[0].node.textContent.substring(nodes[0].startOffset);
        const start = (_b = nodes[0].node.textContent) == null ? void 0 : _b.substring(0, nodes[0].startOffset);
        if (end) {
          editor.dom.nodesInsertAfter([document.createElement("br"), document.createTextNode(end)], nodes[0].node);
          editor.dom.setCaretAt(nodes[0].node.nextSibling.nextSibling, 0);
        } else {
          editor.dom.nodesInsertAfter([document.createElement("br")], nodes[0].node);
          range.selectNode(nodes[0].node.nextSibling);
          range.collapse(false);
        }
        if (start) {
          nodes[0].node.textContent = start;
        } else {
          (_c = nodes[0].node.parentElement) == null ? void 0 : _c.removeChild(nodes[0].node);
        }
        e.preventDefault();
        e.stopPropagation();
        editor.triggerChange();
      }
    },
    {
      event: "onCommand",
      target: ["blockquote"],
      callback: (editor) => {
        var _a, _b, _c;
        const { range } = editor.getSelectionRange();
        const nodes = editor.dom.selectDeepNodesInRange(range);
        if (nodes[0].collapsed) {
          if (nodes[0].node === editor.refContent) {
            const placeholder = document.createElement("blockquote");
            placeholder.appendChild(document.createElement("br"));
            editor.refContent.appendChild(placeholder);
            const endP = document.createElement("P");
            endP.appendChild(document.createElement("BR"));
            editor.refContent.appendChild(endP);
            editor.dom.setCaretAt(placeholder, 0);
            return;
          }
          const paths = usableParent(nodes[0].node, editor);
          const pEL = paths[paths.length - 1].parentElement;
          const endOfEl = nodes[0].collapsed && ["P", "CODE", "BLOCKQUOTE", "H1", "H2", "H3", "H4", "H5", "H6", "DIV"].indexOf(pEL.nodeName) !== -1 && editor.dom.nodeIsText(nodes[0].node) && ((_a = nodes[0].node.textContent) == null ? void 0 : _a.length) === nodes[0].endOffset && pEL.lastChild === paths[paths.length - 1];
          if (endOfEl) {
            const el = document.createElement("blockquote");
            el.appendChild(document.createElement("br"));
            if (pEL === editor.refContent) {
              pEL.appendChild(el);
            } else if (pEL.nodeName === "CODE" && ((_b = pEL.parentElement) == null ? void 0 : _b.nodeName) === "PRE") {
              pEL.parentElement.parentElement.appendChild(el);
            } else {
              pEL.parentElement.appendChild(el);
            }
            if (el === editor.refContent.lastChild) {
              if (el.previousElementSibling && el.previousElementSibling.nodeName === "P") {
                const p = document.createElement("p");
                p.appendChild(document.createElement("br"));
                editor.refContent.appendChild(p);
              } else {
                editor.refContent.appendChild(document.createElement("br"));
              }
            }
            editor.dom.setCaretAt(el.firstChild, 0);
            editor.triggerChange();
            return;
          }
          if (paths[paths.length - 1].nodeType === Node.TEXT_NODE && pEL.childNodes.length === 1 && paths[0].childNodes.length <= 1) {
            if (pEL.nodeName === "BLOCKQUOTE")
              return;
            const el = document.createElement("blockquote");
            if (pEL === editor.refContent) {
              pEL.insertBefore(el, paths[paths.length - 1]);
              el.appendChild(document.createTextNode(paths[paths.length - 1].textContent || ""));
            } else if (pEL.nodeName === "CODE" && ((_c = pEL.parentElement) == null ? void 0 : _c.nodeName) === "PRE") {
              el.appendChild(paths[paths.length - 1]);
              pEL.parentElement.replaceWith(el);
            } else {
              el.appendChild(paths[paths.length - 1]);
              pEL.replaceWith(el);
            }
            if (el === editor.refContent.lastChild) {
              if (el.previousElementSibling && el.previousElementSibling.nodeName === "P") {
                const p = document.createElement("p");
                p.appendChild(document.createElement("br"));
                editor.refContent.appendChild(p);
              } else {
                editor.refContent.appendChild(document.createElement("br"));
              }
            }
            editor.triggerChange();
            return;
          }
        }
        let lastPlaceholdler = null;
        let lastParent = null;
        const breakableParent = (name) => ["P", "CODE", "H1", "H2", "H3", "H4", "H5", "H6"].includes(name);
        nodes.forEach((n) => {
          var _a2, _b2;
          const paths = usableParent(n.node, editor);
          if (paths[paths.length - 1].parentElement.nodeName === "BLOCKQUOTE")
            return;
          const isCodePre = paths[paths.length - 1].parentElement.nodeName === "CODE" && paths[paths.length - 1].parentElement.parentElement.nodeName === "PRE";
          if (!n.collapsed && n.partial) {
            const str = n.node.textContent.substring(n.startOffset, n.endOffset);
            const strBegin = n.node.textContent.substring(0, n.startOffset);
            const strEnd = n.node.textContent.substring(n.endOffset);
            lastPlaceholdler = document.createElement("blockquote");
            lastPlaceholdler.appendChild(document.createTextNode(str));
            if (strEnd) {
              if (breakableParent(paths[paths.length - 1].parentElement.nodeName)) {
                if (isCodePre) {
                  const endEl = document.createElement("PRE");
                  endEl.appendChild(document.createElement("CODE"));
                  endEl.firstChild.appendChild(clonePath(paths, strEnd));
                  editor.dom.nodesInsertAfter([lastPlaceholdler, endEl], paths[paths.length - 1].parentElement.parentElement);
                } else {
                  const endEl = document.createElement(paths[paths.length - 1].parentElement.nodeName);
                  endEl.appendChild(clonePath(paths, strEnd));
                  editor.dom.nodesInsertAfter([lastPlaceholdler, endEl], paths[paths.length - 1].parentElement);
                }
              } else {
                editor.dom.nodesInsertAfter([lastPlaceholdler, clonePath(paths, strEnd)], paths[paths.length - 1]);
              }
            } else {
              if (isCodePre) {
                editor.dom.nodesInsertAfter([lastPlaceholdler], paths[paths.length - 1].parentElement.parentElement);
              } else {
                editor.dom.nodesInsertAfter([lastPlaceholdler], breakableParent(paths[paths.length - 1].parentElement.nodeName) ? paths[paths.length - 1].parentElement : paths[paths.length - 1]);
              }
            }
            if (strBegin) {
              paths[0].textContent = strBegin;
            } else {
              paths[paths.length - 1].parentElement.removeChild(paths[paths.length - 1]);
            }
            editor.dom.setCaretAt(lastPlaceholdler.firstChild, (_a2 = lastPlaceholdler.firstChild.textContent) == null ? void 0 : _a2.length);
            return;
          }
          const pEL = paths[paths.length - 1].parentElement;
          if (paths[0].textContent === "" && pEL.childNodes.length === 0) {
            pEL.remove();
            return;
          }
          if (lastPlaceholdler && lastParent && lastParent === pEL) {
            lastPlaceholdler.appendChild(paths[paths.length - 1]);
          } else {
            lastPlaceholdler = document.createElement("blockquote");
            lastParent = pEL;
            if (isCodePre) {
              if (pEL.firstChild !== paths[paths.length - 1]) {
                const cloneEl = document.createElement("PRE");
                cloneEl.appendChild(document.createElement("CODE"));
                cloneEl.firstChild.appendChild(paths[paths.length - 1].previousSibling);
                while (paths[paths.length - 1].previousSibling) {
                  cloneEl.firstChild.insertBefore(paths[paths.length - 1].previousSibling, cloneEl.firstChild.firstChild);
                }
                pEL.parentElement.parentElement.insertBefore(cloneEl, pEL.parentElement);
              }
              pEL.parentElement.parentElement.insertBefore(lastPlaceholdler, pEL.parentElement);
            } else if (breakableParent(pEL.nodeName)) {
              if (pEL.firstChild !== paths[paths.length - 1]) {
                const cloneEl = document.createElement(pEL.nodeName);
                cloneEl.appendChild(paths[paths.length - 1].previousSibling);
                while (paths[paths.length - 1].previousSibling) {
                  cloneEl.insertBefore(paths[paths.length - 1].previousSibling, cloneEl.firstChild);
                }
                pEL.parentElement.insertBefore(cloneEl, pEL);
              }
              pEL.parentElement.insertBefore(lastPlaceholdler, pEL);
            } else {
              pEL.insertBefore(lastPlaceholdler, paths[paths.length - 1]);
            }
            lastPlaceholdler == null ? void 0 : lastPlaceholdler.appendChild(paths[paths.length - 1]);
          }
          if (pEL.childNodes.length === 0) {
            if (isCodePre) {
              (_b2 = pEL.parentElement) == null ? void 0 : _b2.remove();
            } else {
              pEL.remove();
            }
          }
          if (n === nodes[nodes.length - 1]) {
            editor.dom.setCaretAt(n.node, n.endOffset);
            if (lastPlaceholdler && lastPlaceholdler === editor.refContent.lastChild) {
              if (lastPlaceholdler.parentElement.nodeName === "P") {
                const p = document.createElement("p");
                p.appendChild(document.createElement("br"));
                editor.refContent.appendChild(p);
              } else {
                editor.refContent.appendChild(document.createElement("br"));
              }
            }
          }
        });
        editor.triggerChange();
      }
    },
    {
      event: "onKeyDown",
      target: ["backspace"],
      callback: (editor, e) => {
        if (!editor.feature.path.includes("CODE"))
          return;
        const { range } = editor.getSelectionRange();
        if (!range.collapsed || range.startOffset !== 0 && !(range.startOffset === 1 && (range.startContainer.textContent === " " || range.startContainer.textContent === "\n")))
          return;
        const el = editor.feature.pathNode[editor.feature.path.indexOf("PRE")] || editor.feature.pathNode[editor.feature.path.indexOf("CODE")];
        const prevEl = el.previousSibling;
        if (range.startContainer.textContent === "" || range.startContainer.textContent === "\n") {
          el.remove();
        }
        if (prevEl) {
          range.selectNode(prevEl);
          const nodes = editor.dom.selectDeepNodesInRange(range);
          editor.dom.setCaretAt(nodes[nodes.length - 1].node, nodes[nodes.length - 1].node.textContent.length);
        }
        e.preventDefault();
        e.stopPropagation();
        editor.triggerChange();
      }
    },
    {
      event: "onKeyDown",
      target: ["enter"],
      callback: (editor, e) => {
        var _a, _b, _c;
        if (!((_a = editor.feature) == null ? void 0 : _a.path.includes("CODE")))
          return;
        const { range } = editor.getSelectionRange();
        range.deleteContents();
        range.collapse(false);
        const nodes = editor.dom.selectDeepNodesInRange(range);
        nodes[0].node.textContent = ((_b = nodes[0].node.textContent) == null ? void 0 : _b.substring(0, nodes[0].startOffset)) + "\n" + ((_c = nodes[0].node.textContent) == null ? void 0 : _c.substring(nodes[0].startOffset));
        editor.dom.setCaretAt(nodes[0].node, nodes[0].startOffset + 1);
        e.preventDefault();
        e.stopPropagation();
        editor.triggerChange();
      }
    },
    {
      event: "onCommand",
      target: ["code"],
      callback: (editor) => {
        var _a;
        const { range } = editor.getSelectionRange();
        const nodes = editor.dom.selectDeepNodesInRange(range);
        if (nodes[0].collapsed) {
          if (nodes[0].node === editor.refContent) {
            const placeholder = document.createElement("pre");
            placeholder.appendChild(document.createElement("code"));
            placeholder.firstChild.appendChild(document.createTextNode("\n"));
            editor.refContent.appendChild(placeholder);
            const endP = document.createElement("P");
            endP.appendChild(document.createElement("BR"));
            editor.refContent.appendChild(endP);
            editor.dom.setCaretAt(placeholder, 0);
            return;
          }
          const paths = usableParent(nodes[0].node, editor);
          const pEL = paths[paths.length - 1].parentElement;
          const endOfEl = ["P", "CODE", "BLOCKQUOTE", "H1", "H2", "H3", "H4", "H5", "H6", "DIV"].indexOf(pEL.nodeName) !== -1 && editor.dom.nodeIsText(nodes[0].node) && ((_a = nodes[0].node.textContent) == null ? void 0 : _a.length) === nodes[0].endOffset && pEL.lastChild === paths[paths.length - 1];
          if (endOfEl) {
            const el = document.createElement("pre");
            el.appendChild(document.createElement("code"));
            el.childNodes[0].appendChild(document.createTextNode("\n"));
            if (pEL.nodeName === "CODE" && pEL.parentElement.nodeName === "PRE") {
              pEL.parentElement.parentElement.appendChild(el);
            } else if (pEL === editor.refContent) {
              pEL.appendChild(el);
            } else {
              pEL.parentElement.appendChild(el);
            }
            editor.dom.setCaretAt(el.childNodes[0].childNodes[0], 0);
            if (el === editor.refContent.lastChild) {
              if (el.previousElementSibling && el.previousElementSibling.nodeName === "P") {
                const p = document.createElement("p");
                p.appendChild(document.createElement("br"));
                editor.refContent.appendChild(p);
              } else {
                editor.refContent.appendChild(document.createElement("br"));
              }
            }
            editor.triggerChange();
            return;
          }
          if (paths[paths.length - 1].nodeType === Node.TEXT_NODE && pEL.childNodes.length === 1 && paths[0].childNodes.length <= 1) {
            if (pEL.nodeName === "CODE")
              return;
            const el = document.createElement("pre");
            el.appendChild(document.createElement("code"));
            if (pEL === editor.refContent) {
              pEL.insertBefore(el, paths[paths.length - 1]);
              el.childNodes[0].appendChild(document.createTextNode(paths[paths.length - 1].textContent || ""));
            } else {
              el.childNodes[0].appendChild(paths[paths.length - 1]);
              pEL.replaceWith(el);
            }
            if (el === editor.refContent.lastChild) {
              if (el.previousElementSibling && el.previousElementSibling.nodeName === "P") {
                const p = document.createElement("p");
                p.appendChild(document.createElement("br"));
                editor.refContent.appendChild(p);
              } else {
                editor.refContent.appendChild(document.createElement("br"));
              }
            }
            editor.triggerChange();
            return;
          }
        }
        let lastPlaceholdler = null;
        const breakableParent = (name) => ["P", "BLOCKQUOTE", "H1", "H2", "H3", "H4", "H5", "H6"].includes(name);
        nodes.forEach((n) => {
          var _a2, _b, _c, _d, _e, _f;
          if (n.isVoid)
            return;
          const paths = usableParent(n.node, editor);
          if (paths[paths.length - 1].parentElement.nodeName === "CODE")
            return;
          if (!n.collapsed && n.partial) {
            const str = n.node.textContent.substring(n.startOffset, n.endOffset);
            const strBegin = n.node.textContent.substring(0, n.startOffset);
            const strEnd = n.node.textContent.substring(n.endOffset);
            lastPlaceholdler = document.createElement("pre");
            lastPlaceholdler.appendChild(document.createElement("code"));
            (_a2 = lastPlaceholdler.querySelector("code")) == null ? void 0 : _a2.appendChild(document.createTextNode(str));
            if (strEnd) {
              if (breakableParent(paths[paths.length - 1].parentElement.nodeName)) {
                const endEl = document.createElement(paths[paths.length - 1].parentElement.nodeName);
                endEl.appendChild(clonePath(paths, strEnd));
                editor.dom.nodesInsertAfter([document.createElement("br"), lastPlaceholdler, endEl], paths[paths.length - 1].parentElement);
              } else {
                editor.dom.nodesInsertAfter([document.createElement("br"), lastPlaceholdler, clonePath(paths, strEnd)], paths[paths.length - 1]);
              }
            } else {
              editor.dom.nodesInsertAfter([document.createElement("br"), lastPlaceholdler], breakableParent(paths[paths.length - 1].parentElement.nodeName) ? paths[paths.length - 1].parentElement : paths[paths.length - 1]);
            }
            if (strBegin) {
              paths[0].textContent = strBegin;
            } else {
              paths[paths.length - 1].parentElement.removeChild(paths[paths.length - 1]);
            }
            editor.dom.setCaretAt((_b = lastPlaceholdler.firstChild) == null ? void 0 : _b.firstChild, (_d = (_c = lastPlaceholdler.firstChild) == null ? void 0 : _c.firstChild.textContent) == null ? void 0 : _d.length);
            return;
          }
          if (paths.length > 1) {
            for (var i = 1, j = paths.length; i < j; i++) {
              editor.dom.unwrapNode(paths[i]);
            }
          }
          const pEL = paths[0].parentElement;
          if (paths[0].textContent === "" && pEL.childNodes.length === 0) {
            pEL.remove();
            return;
          }
          if (lastPlaceholdler && lastPlaceholdler === paths[0].previousSibling) {
            lastPlaceholdler.firstChild.appendChild(paths[0]);
            if (pEL.childNodes.length === 0) {
              pEL.remove();
            }
          } else {
            lastPlaceholdler = document.createElement("pre");
            lastPlaceholdler.appendChild(document.createElement("code"));
            (_e = lastPlaceholdler.firstChild) == null ? void 0 : _e.appendChild(document.createTextNode(paths[0].textContent || ""));
            if (breakableParent(pEL.nodeName)) {
              if (pEL.firstChild !== paths[0]) {
                const cloneEl = document.createElement(pEL.nodeName);
                cloneEl.appendChild(paths[0].previousSibling);
                while (paths[0].previousSibling) {
                  cloneEl.insertBefore(paths[0].previousSibling, cloneEl.firstChild);
                }
                pEL.parentElement.insertBefore(cloneEl, pEL);
              }
              pEL.parentElement.insertBefore(lastPlaceholdler, pEL);
            } else {
              pEL.insertBefore(lastPlaceholdler, paths[0]);
            }
            if (pEL.childNodes.length === 1) {
              pEL.remove();
            } else {
              pEL.removeChild(paths[0]);
            }
            if (n === nodes[nodes.length - 1]) {
              editor.dom.setCaretAt((_f = lastPlaceholdler.firstChild) == null ? void 0 : _f.firstChild, n.endOffset);
              if (lastPlaceholdler === editor.refContent.lastChild) {
                if (lastPlaceholdler.parentElement.nodeName === "P") {
                  const p = document.createElement("p");
                  p.appendChild(document.createElement("br"));
                  editor.refContent.appendChild(p);
                } else {
                  editor.refContent.appendChild(document.createElement("br"));
                }
              }
            }
          }
        });
        editor.triggerChange();
      }
    },
    {
      event: "onCommand",
      target: ["p"],
      callback: (editor) => {
        var _a;
        const { range } = editor.getSelectionRange();
        const nodes = editor.dom.selectDeepNodesInRange(range);
        if (nodes.length === 1) {
          const n = nodes[0];
          if (nodes[0].node === editor.refContent && nodes[0].collapsed) {
            const placeholder = document.createElement("P");
            placeholder.appendChild(document.createElement("BR"));
            editor.refContent.appendChild(placeholder);
            editor.dom.setCaretAt(placeholder, 0);
            return;
          }
          const paths = usableParent(nodes[0].node, editor);
          const endOfEl = nodes[0].collapsed && ["P", "CODE", "BLOCKQUOTE", "H1", "H2", "H3", "H4", "H5", "H6"].indexOf(paths[paths.length - 1].parentElement.nodeName) !== -1 && editor.dom.nodeIsText(nodes[0].node) && ((_a = nodes[0].node.textContent) == null ? void 0 : _a.length) === nodes[0].endOffset && paths[paths.length - 1].parentElement.lastChild === paths[paths.length - 1];
          if (n.node.nodeName === "HR" || endOfEl) {
            const p = document.createElement("p");
            p.appendChild(document.createElement("br"));
            if (paths[paths.length - 1].parentElement.nodeName === "CODE" && paths[paths.length - 1].parentElement.parentElement.nodeName === "PRE") {
              paths[paths.length - 1].parentElement.parentElement.parentElement.appendChild(p);
            } else if (paths[paths.length - 1].parentElement === editor.refContent) {
              paths[paths.length - 1].parentElement.appendChild(p);
            } else {
              paths[paths.length - 1].parentElement.parentElement.appendChild(p);
            }
            editor.dom.setCaretAt(p.childNodes[0], 0);
            editor.triggerChange();
            return;
          }
          if (n.collapsed || n.isVoid) {
            if (paths[paths.length - 1].parentElement === editor.refContent) {
              editor.dom.wrapNode(paths[paths.length - 1], document.createElement("p"));
            } else if (paths[paths.length - 1].parentElement.nodeName === "CODE") {
              if (paths[paths.length - 1].parentElement.parentElement.nodeName === "PRE")
                editor.dom.unwrapNode(paths[paths.length - 1].parentElement.parentElement);
              replaceNode(paths[paths.length - 1].parentElement, "P");
            } else if (["H1", "H2", "H3", "H4", "H5", "H6"].indexOf(paths[paths.length - 1].parentElement.nodeName) !== -1) {
              replaceNode(paths[paths.length - 1].parentElement, "P");
            } else {
              editor.dom.wrapNode(paths[paths.length - 1], document.createElement("p"));
            }
          } else {
            const str = n.node.textContent.substring(n.startOffset, n.endOffset);
            const strBegin = n.node.textContent.substring(0, n.startOffset);
            const strEnd = n.node.textContent.substring(n.endOffset);
            n.node.textContent = strBegin;
            const pMiddle = document.createElement("p");
            pMiddle.appendChild(clonePath(paths, str));
            if (paths[paths.length - 1].parentElement.nodeName === "CODE") {
              const pEnd = document.createElement(paths[paths.length - 1].parentElement.nodeName);
              pEnd.appendChild(clonePath(paths, strEnd));
              if (paths[paths.length - 1].parentElement.parentElement.nodeName === "PRE") {
                editor.dom.nodesInsertAfter([pMiddle, pEnd], paths[paths.length - 1].parentElement.parentElement);
                editor.dom.wrapNode(pEnd, document.createElement("PRE"));
              } else {
                editor.dom.nodesInsertAfter([pMiddle, pEnd], paths[paths.length - 1].parentElement);
              }
            } else if (["P", "H1", "H2", "H3", "H4", "H5", "H6"].indexOf(paths[paths.length - 1].parentElement.nodeName) !== -1) {
              const pEnd = document.createElement(paths[paths.length - 1].parentElement.nodeName);
              pEnd.appendChild(clonePath(paths, strEnd));
              editor.dom.nodesInsertAfter([pMiddle, pEnd], paths[paths.length - 1].parentElement);
            } else {
              editor.dom.nodesInsertAfter([pMiddle, clonePath(paths, strEnd)], paths[paths.length - 1]);
            }
            if (!strBegin) {
              paths[paths.length - 1].parentElement.removeChild(paths[paths.length - 1]);
            }
          }
          editor.triggerChange();
          return;
        }
        let lastPlaceholdler = null;
        nodes.forEach((n) => {
          if (n.node.nodeName === "HR")
            return;
          const paths = usableParent(n.node, editor);
          if (paths[paths.length - 1].parentElement.nodeName === "P")
            return;
          if (!n.collapsed && n.partial) {
            const str = n.node.textContent.substring(n.startOffset, n.endOffset);
            const strBegin = n.node.textContent.substring(0, n.startOffset);
            const strEnd = n.node.textContent.substring(n.endOffset);
            lastPlaceholdler = document.createElement("p");
            lastPlaceholdler.appendChild(document.createTextNode(str));
            if (paths[paths.length - 1].parentElement.nodeName === "CODE" && paths[paths.length - 1].parentElement.parentElement.nodeName === "PRE") {
              if (strEnd) {
                const endEl = document.createElement("pre");
                endEl.appendChild(document.createElement("code"));
                endEl.querySelector("code").appendChild(clonePath(paths, strEnd));
                editor.dom.nodesInsertAfter([lastPlaceholdler, endEl], paths[paths.length - 1].parentElement.parentElement);
              } else {
                editor.dom.nodesInsertAfter([lastPlaceholdler], paths[paths.length - 1].parentElement.parentElement);
              }
              if (strBegin) {
                paths[0].textContent = strBegin;
              } else {
                paths[paths.length - 1].parentElement.parentElement.removeChild(paths[paths.length - 1].parentElement);
              }
            } else if (["H1", "H2", "H3", "H4", "H5", "H6", "CODE"].indexOf(paths[paths.length - 1].parentElement.nodeName) !== -1) {
              if (strEnd) {
                const endEl = document.createElement(paths[paths.length - 1].parentElement.nodeName);
                endEl.appendChild(clonePath(paths, strEnd));
                editor.dom.nodesInsertAfter([lastPlaceholdler, endEl], paths[paths.length - 1].parentElement);
              } else {
                editor.dom.nodesInsertAfter([lastPlaceholdler], paths[paths.length - 1].parentElement);
              }
              if (strBegin) {
                paths[0].textContent = strBegin;
              } else {
                paths[paths.length - 1].parentElement.parentElement.removeChild(paths[paths.length - 1].parentElement);
              }
            } else {
              if (strEnd) {
                editor.dom.nodesInsertAfter([lastPlaceholdler, clonePath(paths, strEnd)], paths[paths.length - 1]);
              } else {
                editor.dom.nodesInsertAfter([lastPlaceholdler], paths[paths.length - 1]);
              }
              if (strBegin) {
                paths[0].textContent = strBegin;
              } else {
                paths[paths.length - 1].parentElement.removeChild(paths[paths.length - 1]);
              }
            }
            return;
          }
          if (["H1", "H2", "H3", "H4", "H5", "H6"].indexOf(paths[paths.length - 1].parentElement.nodeName) !== -1) {
            replaceNode(paths[paths.length - 1].parentElement, "P");
          } else if (paths[paths.length - 1].parentElement.nodeName === "CODE") {
            if (paths[paths.length - 1].parentElement.parentElement.nodeName === "PRE")
              editor.dom.unwrapNode(paths[paths.length - 1].parentElement.parentElement);
            replaceNode(paths[paths.length - 1].parentElement, "P");
          } else if (lastPlaceholdler && lastPlaceholdler === paths[paths.length - 1].previousSibling) {
            lastPlaceholdler == null ? void 0 : lastPlaceholdler.appendChild(paths[paths.length - 1]);
          } else {
            lastPlaceholdler = document.createElement("P");
            editor.dom.wrapNode(paths[paths.length - 1], lastPlaceholdler);
          }
        });
        editor.triggerChange();
      }
    },
    {
      event: "onCommand",
      target: ["h1", "h2", "h3", "h4", "h5", "h6"],
      callback: (editor, cmd) => {
        const { range } = editor.getSelectionRange();
        const nodes = editor.dom.selectDeepNodesInRange(range);
        const tag = cmd.toUpperCase();
        const firstTextNode = nodes.find((n) => n.node.nodeType === Node.TEXT_NODE);
        const action = formatAction(firstTextNode == null ? void 0 : firstTextNode.node, tag);
        if (nodes[0].node === editor.refContent && nodes[0].collapsed) {
          const placeholder = document.createElement(cmd);
          placeholder.appendChild(document.createElement("br"));
          editor.refContent.appendChild(placeholder);
          const endP = document.createElement("P");
          endP.appendChild(document.createElement("BR"));
          editor.refContent.appendChild(endP);
          editor.dom.setCaretAt(placeholder, 0);
          return;
        }
        nodes.forEach((n) => {
          const parent = usableParent(n.node, editor);
          const node_action = formatAction(n.node, tag);
          if (action.action === "unwrap" && node_action.action !== "wrap") {
            editor.dom.unwrapNode(node_action.node, editor.refContent);
            return;
          }
          if (n.isVoid) {
            return;
          }
          if (node_action.action === "wrap") {
            const cachedParent = parent[parent.length - 1].parentElement;
            const el = document.createElement(tag);
            if (cachedParent.nodeName === "P") {
              if (n.collapsed && cachedParent.childNodes.length === 1) {
                return replaceNode(cachedParent, tag);
              }
              const p = document.createElement("P");
              let x = parent[parent.length - 1];
              const pnodes = Array.from(x.parentElement.childNodes), idx = pnodes.indexOf(x);
              for (let i = idx + 1, j = pnodes.length; i < j; i++) {
                p.appendChild(pnodes[i]);
              }
              if (!n.collapsed && n.partial) {
                el.appendChild(document.createTextNode(n.node.textContent.substring(n.startOffset, n.endOffset)));
                const partBeginning = n.node.textContent.substring(0, n.startOffset) || "", partEnding = n.node.textContent.substring(n.endOffset) || "";
                if (partBeginning !== "") {
                  n.node.textContent = partBeginning;
                } else {
                  n.node.parentNode.removeChild(n.node);
                }
                if (partEnding !== "") {
                  if (p.childNodes.length > 0) {
                    p.insertBefore(document.createTextNode(partEnding), p.childNodes[0]);
                  } else {
                    p.appendChild(document.createTextNode(partEnding));
                  }
                }
              } else {
                el.appendChild(parent[parent.length - 1]);
              }
              editor.dom.nodesInsertAfter([el, p], cachedParent);
              if (cachedParent.innerHTML === "") {
                cachedParent.remove();
              }
              if (p.childNodes.length === 0) {
                p.remove();
              }
              if (n === nodes[nodes.length - 1] && el === editor.refContent.childNodes[editor.refContent.childNodes.length - 1]) {
                const endP = document.createElement("P");
                endP.appendChild(document.createElement("BR"));
                editor.refContent.appendChild(endP);
              }
            } else {
              if (!n.collapsed && n.partial) {
                el.appendChild(document.createTextNode(n.node.textContent.substring(n.startOffset, n.endOffset)));
                const partBeginning = n.node.textContent.substring(0, n.startOffset) || "", partEnding = n.node.textContent.substring(n.endOffset) || "";
                editor.dom.nodesInsertAfter([el], n.node);
                if (partBeginning !== "") {
                  n.node.textContent = partBeginning;
                } else {
                  n.node.parentNode.removeChild(n.node);
                }
                if (partEnding !== "") {
                  editor.dom.nodesInsertAfter([document.createTextNode(partEnding)], el);
                }
              } else {
                editor.dom.wrapNode(parent[parent.length - 1], el);
              }
              if (n === nodes[nodes.length - 1] && el === editor.refContent.childNodes[editor.refContent.childNodes.length - 1]) {
                editor.refContent.appendChild(document.createElement("BR"));
              }
            }
          } else if (node_action.action === "replace") {
            replaceNode(node_action.node, tag);
          }
        });
        if (nodes[nodes.length - 1].isVoid) {
          editor.dom.setCaretAt(nodes[nodes.length - 1].node, 1);
        } else {
          editor.dom.setCaretAt(range.endContainer, range.endOffset);
        }
        editor.triggerChange();
      }
    }
  ];

  // src/plugins/remove_format.ts
  var remove_format_default2 = [
    {
      event: "onCommand",
      target: ["remove_format"],
      callback: (editor) => {
        const { range } = editor.getSelectionRange();
        const nodes = editor.dom.selectDeepNodesInRange(range);
        nodes.forEach((node) => {
          let el = node.node.nodeType === Node.TEXT_NODE ? node.node.parentElement : node.node;
          while (["DIV", "TD", "LI"].indexOf(el.nodeName) === -1) {
            if (["H1", "H2", "H3", "H4", "H5", "H6", "CODE", "B", "STRONG", "I", "EM", "U", "PRE", "BLOCKQUOTE", "A", "STRIKE", "SUB", "SUP", "SPAN"].indexOf(el.nodeName) !== -1) {
              const unwrap = el;
              el = el.parentElement;
              editor.dom.unwrapNode(unwrap);
            } else {
              if (el.style.color)
                el.style.color = "";
              if (el.style.backgroundColor)
                el.style.backgroundColor = "";
              el = el.parentElement;
            }
          }
          if (el.style.color)
            el.style.color = "";
          if (el.style.backgroundColor)
            el.style.backgroundColor = "";
        });
        editor.triggerChange();
      }
    }
  ];

  // src/plugins/link.ts
  var link_default2 = [
    {
      event: "onCommand",
      target: ["link"],
      callback: (editor, cmd, action, url, text, target) => {
        var _a, _b, _c;
        const { range } = editor.getSelectionRange();
        if (action === "remove" && ((_a = editor.feature) == null ? void 0 : _a.a.node)) {
          editor.dom.unwrapNode((_b = editor.feature) == null ? void 0 : _b.a.node);
          editor.triggerChange();
          return;
        } else if (action === "update" && ((_c = editor.feature) == null ? void 0 : _c.a.node)) {
          const n = editor.feature.a.node, offset = range.endOffset;
          n.href = url || "";
          n.target = target || "";
          n.textContent = text || "";
          editor.dom.setCaretAt(n.firstChild, Math.min(offset, text.length));
          editor.triggerChange();
          return;
        }
        range.deleteContents();
        range.collapse(false);
        let node = document.createElement("a");
        node.href = url || "";
        node.target = target || "";
        node.textContent = text || "";
        if (range.endContainer.parentElement.nodeName === "CODE") {
          let el = range.endContainer.parentElement;
          if (el.parentElement.nodeName === "PRE")
            el = el.parentElement;
          editor.dom.nodesInsertAfter([node], el);
        } else {
          range.insertNode(node);
        }
        editor.dom.setCaretAt(node.firstChild, node.textContent.length);
        editor.triggerChange();
      }
    },
    {
      event: "onCommand",
      target: ["remove_link"],
      callback: (editor) => {
        var _a, _b, _c, _d, _e;
        const { selection } = editor.getSelectionRange();
        const c = (_b = (_a = editor.feature) == null ? void 0 : _a.a.node) == null ? void 0 : _b.childNodes[0];
        let offset = (selection == null ? void 0 : selection.focusOffset) || 0, el = selection == null ? void 0 : selection.focusNode;
        if ((_c = editor.feature) == null ? void 0 : _c.a.node) {
          editor.dom.unwrapNode((_d = editor.feature) == null ? void 0 : _d.a.node);
          if (((_e = c == null ? void 0 : c.previousSibling) == null ? void 0 : _e.nodeType) === Node.TEXT_NODE) {
            if (el === c) {
              el = c.previousSibling;
              offset = el.textContent.length + offset;
            }
            c.previousSibling.textContent += c.textContent || "";
            c.remove();
          }
          if (el)
            editor.dom.setCaretAt(el, offset);
          editor.triggerChange();
        }
      }
    }
  ];

  // src/paste.ts
  function mergeTag(nodes, tag) {
    var _a;
    const length = nodes.length;
    if (length === 0)
      return;
    for (let i = length - 1; i >= 0; i--) {
      let cur = nodes[i], prev = cur.previousSibling;
      if (prev && prev.nodeName.toLowerCase() === tag) {
        prev.textContent += cur.textContent || "";
        (_a = cur.parentNode) == null ? void 0 : _a.removeChild(cur);
      }
    }
  }
  function cleanupHtml(html) {
    var _a, _b;
    if (!html.trim())
      return html;
    let parser = new DOMParser();
    let doc = parser.parseFromString('<html><head><meta charset="utf-8"></head><body>' + html + "</body></html>", "text/html");
    let els = doc.querySelectorAll("*"), length = els.length;
    for (let i = 1; i < length; i++) {
      let el = els[i];
      normalizeStyle(el);
    }
    let body = doc.querySelector("body");
    body.normalize();
    let spans = doc.querySelectorAll("body span");
    length = spans.length;
    for (let i = length - 1; i >= 0; i--) {
      let cur = spans[i], prev = cur.previousSibling, curStyle = cur.getAttribute("style");
      if (prev && (prev.nodeType === 3 && !curStyle || prev.nodeName === "SPAN" && curStyle === prev.getAttribute("style"))) {
        prev.textContent += cur.textContent || "";
        (_a = cur.parentNode) == null ? void 0 : _a.removeChild(cur);
      }
    }
    let bs = doc.querySelectorAll("body b");
    for (let i = bs.length - 1; i >= 0; i--) {
      let n = bs[i], el = document.createElement("strong");
      el.innerHTML = n.innerHTML;
      n.replaceWith(el);
    }
    bs = doc.querySelectorAll("body i");
    for (let i = bs.length - 1; i >= 0; i--) {
      let n = bs[i], el = document.createElement("em");
      el.innerHTML = n.innerHTML;
      n.replaceWith(el);
    }
    const mergerTags = ["strong", "em", "u", "strike", "sub", "sup", "strong", "em", "u", "strike", "sub", "sup"];
    mergerTags.forEach((tag) => {
      mergeTag(Array.from(doc.querySelectorAll("body " + tag)), tag);
    });
    let nodes = doc.querySelectorAll("body > meta, body > title, body > style");
    for (let i = nodes.length - 1; i >= 0; i--) {
      if (nodes[i])
        (_b = nodes[i].parentNode) == null ? void 0 : _b.removeChild(nodes[i]);
    }
    return body.innerHTML;
  }
  function normalizeStyle(el) {
    let cssText = "", tag = el.nodeName.toLowerCase(), str = el.getAttribute("style");
    el.removeAttribute("class");
    if (!str)
      return;
    if (["tr", "td", "th", "tbody", "tfoot"].indexOf(tag) !== -1) {
      el.removeAttribute("style");
      return;
    }
    let attr = el.getAttribute("align");
    if (attr) {
      attr = attr.trim().toLowerCase();
      if (attr !== "start") {
        str = "text-align:" + attr + ";" + str;
      }
      el.removeAttribute("align");
    }
    const s = str.split(";");
    s.forEach((pair) => {
      if (!pair.trim())
        return;
      const p = pair.split(":");
      if (p.length === 1)
        return;
      const y = p[0].trim().toLowerCase();
      const v = p[1].trim();
      if (["inherit", "auto", "none", "0px"].indexOf(v) !== -1) {
        return;
      }
      switch (y) {
        case "width":
        case "height":
        case "padding-left":
          if (parseFloat(v) !== 0) {
            cssText += y + ": " + v + ";";
          }
          break;
        case "color":
          cssText += y + ": " + v + ";";
          break;
        case "text-align":
          attr = v.toLowerCase();
          if (attr !== "start") {
            cssText += y + ": " + attr + ";";
          }
          break;
        case "border":
          if (v.indexOf("0px") !== -1) {
            cssText += y + ": " + v + ";";
          }
          break;
        case "background":
          if (v && v.indexOf("url(") === 0) {
            cssText += y + ": " + el.style.background + ";";
          }
          break;
        case "background-color":
          if (v && v.indexOf("transparent") === -1 && v.toLowerCase() !== "#fff" && v.toLowerCase() !== "#ffffff") {
            cssText += y + ": " + v + ";";
          }
          break;
        default:
          break;
      }
    });
    if (cssText)
      el.setAttribute("style", cssText);
    else
      el.removeAttribute("style");
  }

  // src/plugins/paste.ts
  var paste_default = [
    {
      event: "onPaste",
      target: [],
      callback: (editor, e) => {
        var _a, _b, _c, _d, _e, _f;
        e.preventDefault();
        e.stopPropagation();
        if (!e.clipboardData)
          return;
        const html = cleanupHtml(e.clipboardData.getData("text/html") || e.clipboardData.getData("text/plain"));
        const { range } = editor.getSelectionRange();
        range.deleteContents();
        if ((_a = editor.feature) == null ? void 0 : _a.path.includes("CODE")) {
          if (range.endContainer.nodeType === Node.TEXT_NODE) {
            const endOffset = range.endOffset, offset = endOffset + html.length;
            range.endContainer.textContent = ((_b = range.endContainer.textContent) == null ? void 0 : _b.substring(0, endOffset)) + html + ((_c = range.endContainer.textContent) == null ? void 0 : _c.substring(endOffset));
            editor.dom.setCaretAt(range.endContainer, offset);
          }
        } else {
          const pholder = document.createElement("div");
          pholder.innerHTML = html;
          if (range.endContainer.nodeType === Node.TEXT_NODE) {
            const end = document.createTextNode(range.endContainer.textContent.substring(range.endOffset));
            range.endContainer.textContent = range.endContainer.textContent.substring(0, range.endOffset);
            editor.dom.nodesInsertAfter([...Array.from(pholder.childNodes), end], range.endContainer);
            editor.dom.setCaretAt(end, 0);
          } else {
            range.insertNode(pholder);
            if (pholder.nextSibling)
              editor.dom.setCaretAt(pholder.nextSibling, 0);
            else
              editor.dom.setCaretAt(pholder.lastChild, ((_d = pholder.lastChild) == null ? void 0 : _d.childNodes.length) || ((_f = (_e = pholder.lastChild) == null ? void 0 : _e.textContent) == null ? void 0 : _f.length));
            editor.dom.unwrapNode(pholder);
          }
        }
        editor.triggerChange();
      }
    },
    {
      event: "onKeyUp",
      target: ["ctrl+v", "cmd+v"],
      callback: (editor, e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  ];

  // src/plugins/list.ts
  var usableParent2 = (node, editor) => {
    const path = [];
    do {
      path.push(node);
      node = node.parentNode;
    } while (editor.dom.nodeIsTextInlineOrVoid(node));
    return path;
  };
  var list_default2 = [
    {
      event: "onKeyDown",
      target: ["enter"],
      callback: (editor) => {
        if (!editor.feature.path.includes("LI"))
          return;
        const { range } = editor.getSelectionRange();
        const nodes = editor.dom.selectDeepNodesInRange(range);
        if (nodes.length === 0)
          return;
        const firstNode = nodes[0].node;
        const pFirstNode = editor.dom.nodeParent(firstNode, "LI");
        const listNode = pFirstNode == null ? void 0 : pFirstNode.parentElement;
        if (!pFirstNode || pFirstNode.textContent !== "" || editor.dom.nodeParent(pFirstNode.parentElement, "LI"))
          return;
        setTimeout(() => {
          const div = listNode.nextElementSibling;
          if (div.nodeName === "DIV") {
            if (div.textContent === "") {
              if (listNode.previousElementSibling && listNode.previousElementSibling.nodeName === "P") {
                const p = document.createElement("P");
                p.appendChild(document.createElement("BR"));
                div.replaceWith(p);
                editor.dom.setCaretAt(p.firstChild, 0);
              } else {
                const br = document.createElement("br");
                div.replaceWith(br);
                editor.dom.setCaretAt(br, 0);
              }
              editor.triggerChange();
              return;
            }
          }
        }, 1);
      }
    },
    {
      event: "onKeyDown",
      target: ["backspace"],
      callback: (editor, e) => {
        var _a;
        if (!editor.feature.path.includes("LI"))
          return;
        const { range } = editor.getSelectionRange();
        if (range.startOffset !== 0)
          return;
        const nodes = editor.dom.selectDeepNodesInRange(range);
        if (nodes.length === 0)
          return;
        const firstNode = nodes[0].node;
        const pFirstNode = editor.dom.nodeParent(firstNode, "LI");
        if (!pFirstNode || ((_a = pFirstNode.textContent) == null ? void 0 : _a.indexOf(firstNode.textContent)) !== 0 || pFirstNode !== pFirstNode.parentElement.firstElementChild)
          return;
        const upperListLi = editor.dom.nodeParent(pFirstNode.parentElement, "LI");
        if (!upperListLi)
          return;
        e.preventDefault();
        e.stopPropagation();
        const listDelete = pFirstNode.parentElement;
        const lis = [];
        Array.from(pFirstNode.parentElement.childNodes).forEach((n) => {
          if (n.textContent !== "")
            lis.push(n);
        });
        editor.dom.nodesInsertAfter(lis, upperListLi);
        listDelete.remove();
      }
    },
    {
      event: "onKeyDown",
      target: ["tab"],
      callback: (editor, e) => {
        var _a;
        if (!editor.feature.path.includes("LI"))
          return;
        const { range } = editor.getSelectionRange();
        if (range.startOffset !== 0)
          return;
        const nodes = editor.dom.selectDeepNodesInRange(range);
        if (nodes.length === 0)
          return;
        const firstNode = nodes[0].node;
        const pFirstNode = editor.dom.nodeParent(firstNode, "LI");
        if (!pFirstNode || ((_a = pFirstNode.textContent) == null ? void 0 : _a.indexOf(firstNode.textContent)) !== 0 || pFirstNode === pFirstNode.parentElement.firstElementChild)
          return;
        e.preventDefault();
        e.stopPropagation();
        const li = document.createElement("LI");
        Array.from(pFirstNode.childNodes).forEach((n) => li.appendChild(n));
        const ul = document.createElement("UL");
        ul.appendChild(li);
        pFirstNode.previousElementSibling.appendChild(ul);
        nodes.forEach((n) => {
          if (n.node === firstNode)
            return;
          const pNode = editor.dom.nodeParent(n.node, "LI");
          ul.appendChild(pNode);
        });
        pFirstNode.parentElement.removeChild(pFirstNode);
        range.selectNode(ul.firstElementChild);
        range.collapse(true);
      }
    },
    {
      event: "onCommand",
      target: ["list", "ol", "ul"],
      callback: (editor, type, cmd) => {
        var _a, _b, _c, _d;
        if ((_a = editor.feature) == null ? void 0 : _a.path.includes("CODE"))
          return;
        if (type === "ol" || type === "ul")
          cmd = type;
        const { range } = editor.getSelectionRange();
        const swap = cmd === "ol" ? "UL" : "OL", rangeEl = range.endContainer, rangeOffset = range.endOffset;
        const nodes = editor.dom.selectDeepNodesInRange(range);
        range.collapse(false);
        const focusNode = () => editor.dom.setCaretAt(rangeEl, rangeOffset);
        if (nodes.length === 0)
          return;
        if (nodes[0].node === editor.refContent && editor.refContent.textContent === "") {
          editor.refContent.appendChild(document.createElement(cmd));
          (_b = editor.refContent.firstChild) == null ? void 0 : _b.appendChild(document.createElement("li"));
          range.selectNode(editor.refContent.firstChild.firstChild);
          range.collapse(true);
          return;
        }
        const firstNode = nodes[0].node, firstPath = editor.dom.nodeParentUntil(firstNode, editor.refContent);
        if (firstPath.find((el) => el.nodeName === "CODE"))
          return;
        if (((_d = (_c = firstPath.find((el) => el.nodeName === "LI")) == null ? void 0 : _c.parentElement) == null ? void 0 : _d.nodeName) === swap) {
          nodes.forEach((n) => {
            var _a2;
            const list = (_a2 = editor.dom.nodeParent(n.node, "LI", editor.refContent)) == null ? void 0 : _a2.parentElement;
            if (list && list.nodeName !== cmd) {
              const el = document.createElement(cmd);
              Array.from(list.childNodes).forEach((element) => el.appendChild(element));
              list.parentElement.insertBefore(el, list);
              list.parentElement.removeChild(list);
            }
          });
          focusNode();
          editor.triggerChange();
          return;
        }
        if (nodes.find((n) => editor.dom.nodeParentUntil(n.node, editor.refContent).find((el) => el.nodeName === "LI"))) {
          const ols = [];
          nodes.forEach((n) => {
            const li = editor.dom.nodeParent(n.node, "LI", editor.refContent);
            ols.push(li == null ? void 0 : li.parentElement);
            if (li) {
              if (li !== li.parentElement.lastChild) {
                li == null ? void 0 : li.appendChild(document.createElement("br"));
              }
              editor.dom.unwrapNode(li, editor.refContent);
            }
          });
          ols.forEach((ol) => {
            if (ol.querySelectorAll("li").length === 0) {
              editor.dom.unwrapNode(ol, editor.refContent);
              return;
            }
            let placeholder = null;
            for (let i = ol.childNodes.length - 1; i >= 0; i--) {
              if (ol.childNodes[i].nodeName !== "LI") {
                editor.dom.nodesInsertAfter([ol.childNodes[i]], ol);
                placeholder = null;
              } else {
                if (placeholder) {
                  placeholder.insertBefore(ol.childNodes[i], placeholder.childNodes[0]);
                } else {
                  placeholder = document.createElement(ol.nodeName);
                  placeholder.appendChild(ol.childNodes[i]);
                  editor.dom.nodesInsertAfter([placeholder], ol);
                }
              }
            }
            if (ol.querySelectorAll("li").length === 0) {
              editor.dom.unwrapNode(ol, editor.refContent);
            }
          });
          focusNode();
          editor.triggerChange();
          return;
        }
        let lastPlaceholder = null;
        nodes.forEach((n) => {
          var _a2;
          const paths = usableParent2(n.node, editor), el = paths[paths.length - 1];
          if (!lastPlaceholder || el.previousElementSibling !== lastPlaceholder) {
            lastPlaceholder = document.createElement(cmd);
            if (el === editor.refContent) {
              editor.refContent.appendChild(lastPlaceholder);
            } else {
              (_a2 = el.parentElement) == null ? void 0 : _a2.insertBefore(lastPlaceholder, el);
            }
          }
          editor.dom.wrapNode(el, document.createElement("li"));
          lastPlaceholder == null ? void 0 : lastPlaceholder.appendChild(el.parentElement);
        });
        editor.dom.setCaretAt(lastPlaceholder.lastChild.lastChild, 0);
        editor.triggerChange();
      }
    }
  ];

  // src/plugins/table.ts
  function table_style(editor, value) {
    if (!editor.feature.node)
      return;
    const node = editor.dom.nodeParent(editor.feature.node, "TABLE");
    if (!node)
      return;
    node.setAttribute("style", value);
  }
  function cell_style(editor, value, applyTo) {
    var _a;
    if (!editor.feature.node)
      return;
    const node = editor.dom.nodeParent(editor.feature.node, "TD") || editor.dom.nodeParent(editor.feature.node, "TH");
    if (!node)
      return;
    if (applyTo === "cell") {
      node.setAttribute("style", value);
    } else if (applyTo === "row") {
      Array.from((_a = node.parentElement) == null ? void 0 : _a.querySelectorAll(node.nodeName)).forEach((n) => n.setAttribute("style", value));
    } else if (applyTo === "all") {
      Array.from(editor.dom.nodeParent(node, "TBODY").querySelectorAll("TD")).forEach((n) => n.setAttribute("style", value));
    }
  }
  function table_function(editor, value) {
    if (!editor.feature.node)
      return;
    const node = editor.dom.nodeParent(editor.feature.node, "TD") || editor.dom.nodeParent(editor.feature.node, "TH");
    if (!node)
      return;
    const func = {}, table = editor.dom.nodeParent(node, "TABLE"), tbody = table.querySelector("TBODY"), pos = editor.dom.nodePosition(node);
    const headerStyle = editor.getCfg("table.default.header.cell.style"), cellStyle = editor.getCfg("table.default.cell.style");
    const tableCellList = editor.dom.table.cellList(table, true), tableUniqueCellList = editor.dom.table.cellList(table, true, true);
    const nodeIndexList = (tr, useNull = true) => {
      const row = Array.from(table.querySelectorAll("TR")).indexOf(tr);
      return useNull ? tableUniqueCellList[row] : tableCellList[row];
    };
    const colPosition = (n) => {
      return nodeIndexList(n.parentElement).indexOf(n);
    };
    func["insert_header"] = () => {
      const tds = Array.from(editor.dom.nodeParent(node, "TR").querySelectorAll("td")), thead = table.querySelector("thead");
      if (thead)
        return;
      let h = document.createElement("thead");
      h.appendChild(document.createElement("tr"));
      for (let i = 0, t = tds.length; i < t; i++) {
        const th = document.createElement("th");
        if (tds[i].colSpan > 1)
          th.setAttribute("colspan", tds[i].colSpan.toString());
        if (headerStyle)
          th.setAttribute("style", headerStyle);
        th.appendChild(document.createElement("br"));
        h.childNodes[0].appendChild(th);
      }
      table.insertBefore(h, table.querySelector("tbody"));
    };
    func["delete_header"] = () => {
      const thead = editor.dom.nodeParent(node, "THEAD");
      if (thead) {
        editor.dom.setCaretAt(tbody.querySelectorAll("td")[pos], 0);
        thead.parentNode.removeChild(thead);
      }
    };
    func["delete_row"] = () => {
      const tr = editor.dom.nodeParent(node, "TR");
      if (!tr)
        return;
      const posTR = editor.dom.nodePosition(tr);
      let idx = 0, trs = Array.from(tr.parentElement.childNodes);
      if (posTR + 1 < trs.length)
        idx = posTR + 1;
      else if (posTR > 0)
        idx = posTR - 1;
      if (trs.length > 1 && trs[idx]) {
        editor.dom.setCaretAt(trs[idx].childNodes[Math.min(pos, trs[idx].childNodes.length - 1)], 0);
      }
      let prevNode = null;
      nodeIndexList(tr, false).forEach((td) => {
        const rowSpan2 = editor.dom.table.rowSpan(td);
        if (prevNode === td)
          return;
        prevNode = td;
        if (!tr.contains(td)) {
          if (1 < rowSpan2) {
            if (rowSpan2 === 2)
              td.removeAttribute("rowspan");
            else
              td.setAttribute("rowspan", (rowSpan2 - 1).toString());
          }
          return;
        }
        if (rowSpan2 > 1 && tr.nextElementSibling) {
          const nodeList = nodeIndexList(tr.nextElementSibling, false), nodePos = nodeList.indexOf(td);
          if (nodePos !== -1) {
            const beforeNode = nodeList.find((el, i) => i < nodePos && el !== null && tr.nextElementSibling.contains(el));
            if (beforeNode) {
              editor.dom.nodesInsertAfter([td], beforeNode);
            } else {
              tr.nextElementSibling.insertBefore(td, tr.nextElementSibling.childNodes[0]);
            }
            if (1 < rowSpan2) {
              if (rowSpan2 === 2)
                td.removeAttribute("rowspan");
              else
                td.setAttribute("rowspan", (rowSpan2 - 1).toString());
            }
          }
        }
      });
      tr.parentNode.removeChild(tr);
      if (tbody.querySelectorAll("td").length === 0)
        table.remove();
    };
    func["delete_column"] = () => {
      let tr = editor.dom.nodeParent(node, "TR");
      if (!tr || !table || !tr.childElementCount)
        return;
      if (pos === -1)
        return;
      if (tr.childNodes.length === 1) {
        table.remove();
        return;
      }
      if (node.nextElementSibling) {
        editor.dom.setCaretAt(node.nextElementSibling, 0);
      } else if (node.previousElementSibling) {
        editor.dom.setCaretAt(node.previousElementSibling, 0);
      }
      const nodeColPosition = colPosition(node), colspan = editor.dom.table.colSpan(node);
      const trs = Array.from(table.querySelectorAll("tr"));
      const allNodeList = tableUniqueCellList;
      const IndexDelete = [];
      for (var i = 0; i < colspan; i++) {
        IndexDelete.push(nodeColPosition + i);
      }
      trs.forEach((r, idx) => {
        if (r === tr) {
          r.removeChild(r.childNodes[pos]);
        } else {
          const nodeList = allNodeList[idx];
          let prevNode = null;
          for (var i2 = 0, t = IndexDelete.length; i2 < t; i2++) {
            if (prevNode === nodeList[IndexDelete[i2]] || !nodeList[IndexDelete[i2]])
              continue;
            prevNode = nodeList[IndexDelete[i2]];
            const span = editor.dom.table.colSpan(prevNode);
            if (span === 1) {
              r.removeChild(prevNode);
              prevNode = null;
            } else {
              if (span - 1 === 1)
                prevNode.removeAttribute("colspan");
              else
                prevNode.setAttribute("colspan", (span - 1).toString());
            }
          }
        }
      });
      if ((tbody == null ? void 0 : tbody.querySelectorAll("td").length) === 0)
        table.remove();
    };
    func["insert_row_above"] = () => {
      let tr = editor.dom.nodeParent(node, "TR"), tds = tr.querySelectorAll("td");
      if (!tr || !tbody || !tds.length)
        return;
      let ntr = document.createElement("tr");
      for (let i = 0, t = tr.childElementCount; i < t; i++) {
        const td = tr.childNodes[i].cloneNode(false);
        if (cellStyle)
          td.setAttribute("style", cellStyle);
        td.appendChild(document.createElement("br"));
        ntr.appendChild(td);
      }
      tbody.insertBefore(ntr, tr);
    };
    func["insert_row_below"] = () => {
      let tr = editor.dom.nodeParent(node, "TR");
      let ntr = document.createElement("tr");
      for (let i = 0, t = tr.childElementCount; i < t; i++) {
        const td = tr.childNodes[i].cloneNode(false);
        if (cellStyle)
          td.setAttribute("style", cellStyle);
        td.appendChild(document.createElement("br"));
        ntr.appendChild(td);
      }
      editor.dom.nodesInsertAfter([ntr], tr);
    };
    func["insert_column_left"] = () => {
      const allNodeList = tableUniqueCellList;
      const nodeColPosition = colPosition(node);
      const trs = Array.from(table.querySelectorAll("tr")), row = trs.indexOf(node.parentElement);
      let normalizedPos = nodeColPosition;
      if (allNodeList[row][normalizedPos] === null) {
        for (let i = row; i >= 0; i--) {
          normalizedPos--;
          if (allNodeList[row][normalizedPos] !== null)
            break;
        }
      }
      const singleCell = editor.dom.table.colSpan(node) === 1 && normalizedPos === nodeColPosition;
      trs.forEach((r, idx) => {
        const nodeList = allNodeList[idx];
        const n = nodeList[normalizedPos];
        if (!n)
          return;
        if (singleCell && normalizedPos > 0 && nodeList[normalizedPos - 1] === n) {
          const span = editor.dom.table.colSpan(n) + 1;
          n.setAttribute("colspan", span.toString());
          return;
        }
        const td = document.createElement(n.nodeName);
        if (cellStyle)
          td.setAttribute("style", cellStyle);
        td.appendChild(document.createElement("br"));
        const rowSpan2 = editor.dom.table.rowSpan(n);
        if (rowSpan2 > 1)
          td.setAttribute("rowspan", rowSpan2.toString());
        r.insertBefore(td, n);
      });
    };
    func["insert_column_right"] = () => {
      const allNodeList = tableUniqueCellList;
      const nodeColPosition = colPosition(node);
      const trs = Array.from(table.querySelectorAll("tr")), row = trs.indexOf(node.parentElement);
      let normalizedPos = nodeColPosition;
      if (allNodeList[row][normalizedPos] === null) {
        for (let i = row; i >= 0; i--) {
          normalizedPos--;
          if (allNodeList[row][normalizedPos] !== null) {
            break;
          }
        }
      }
      while (allNodeList[row].length > normalizedPos + 1 && allNodeList[row][normalizedPos + 1] === allNodeList[row][normalizedPos]) {
        normalizedPos++;
      }
      const singleCell = editor.dom.table.colSpan(node) === 1 && normalizedPos === nodeColPosition;
      trs.forEach((r, idx) => {
        const nodeList = allNodeList[idx];
        const n = nodeList[normalizedPos];
        if (!n)
          return;
        if (singleCell && normalizedPos + 1 < nodeList.length && nodeList[normalizedPos + 1] === n) {
          const span = editor.dom.table.colSpan(n) + 1;
          n.setAttribute("colspan", span.toString());
          return;
        }
        const td = document.createElement(n.nodeName);
        if (cellStyle)
          td.setAttribute("style", cellStyle);
        td.appendChild(document.createElement("br"));
        const rowSpan2 = editor.dom.table.rowSpan(n);
        if (rowSpan2 > 1)
          td.setAttribute("rowspan", rowSpan2.toString());
        editor.dom.nodesInsertAfter([td], n);
      });
    };
    func["merge_down"] = () => {
      let tr = editor.dom.nodeParent(node, "TR"), trs = tbody.querySelectorAll("tr");
      const row = editor.dom.nodePosition(tr);
      const rowspan = parseInt(node.getAttribute("rowspan") || "1", 10);
      if (trs.length <= row + rowspan)
        return;
      const nodeList = nodeIndexList(trs[row]), nextNodeList = nodeIndexList(trs[row + rowspan]);
      const col2 = nodeList.indexOf(node);
      if (editor.dom.table.colSpan(nodeList[col2]) !== editor.dom.table.colSpan(nextNodeList[col2]))
        return;
      editor.dom.nodeChildInsertInto(node, nextNodeList[col2]);
      trs[row + rowspan].removeChild(nextNodeList[col2]);
      if (trs[row + rowspan].childElementCount === 0)
        trs[row + rowspan].remove();
      if (tr.childNodes.length === 1) {
        node.removeAttribute("rowspan");
      } else {
        let span = parseInt(node.getAttribute("rowspan") || "1", 10) + 1;
        node.setAttribute("rowspan", span.toString());
      }
    };
    func["merge_right_header"] = () => {
      let tr = editor.dom.nodeParent(node, "TR");
      const col2 = editor.dom.nodePosition(node);
      if (tr.childElementCount <= col2 + 1)
        return;
      let mergetd;
      const mergetds = tr.querySelectorAll("th");
      if (mergetds.length > col2 + 1 && mergetds[col2 + 1]) {
        mergetd = mergetds[col2 + 1];
      }
      if (mergetd) {
        editor.dom.nodeChildInsertInto(node, mergetd);
        let span = parseInt(node.getAttribute("colspan") || "1", 10) + 1;
        node.setAttribute("colspan", span.toString());
        mergetd.parentNode.removeChild(mergetd);
      }
    };
    func["merge_right"] = () => {
      if (node.nodeName === "TH")
        return func["merge_right_header"]();
      let tr = editor.dom.nodeParent(node, "TR"), trs = tbody.querySelectorAll("tr");
      const col2 = editor.dom.nodePosition(node), row = editor.dom.nodePosition(tr);
      const rowspan = parseInt(node.getAttribute("rowspan") || "1", 10);
      if (tr.childNodes.length <= col2 + 1)
        return;
      let mergedspans = rowspan;
      for (var i = row; i < row + rowspan; i++) {
        if (!trs[i])
          break;
        const tds = trs[i].querySelectorAll("td");
        const colIdx = i === row ? col2 + 1 : col2;
        if (tds[colIdx]) {
          const span2 = parseInt(tds[colIdx].getAttribute("rowspan") || "1", 10);
          editor.dom.nodeChildInsertInto(node, tds[colIdx]);
          trs[i].removeChild(tds[colIdx]);
          mergedspans -= span2;
          if (mergedspans <= 0) {
            while (mergedspans < 0) {
              const td = document.createElement("td");
              td.appendChild(document.createElement("br"));
              if (trs[i].childElementCount > col2) {
                trs[i].insertBefore(td, trs[i].childNodes[col2]);
              } else {
                trs[i].appendChild(td);
              }
              mergedspans++;
            }
            if (trs[i].childElementCount === 0) {
              trs[i].parentNode.removeChild(trs[i]);
            }
            break;
          }
        }
      }
      if (rowspan > 1 && tr.childNodes.length === 1) {
        node.removeAttribute("rowspan");
      }
      let span = parseInt(node.getAttribute("colspan") || "1", 10) + 1;
      node.setAttribute("colspan", span.toString());
    };
    func["unmerge_header"] = () => {
      const col2 = editor.dom.nodePosition(node), nodecol = parseInt(node.getAttribute("colspan") || "1", 10);
      if (nodecol === 1)
        return;
      for (let j = col2 + 1; j < col2 + nodecol; j++) {
        const td = document.createElement(node.nodeName);
        if (cellStyle)
          td.setAttribute("style", cellStyle);
        td.appendChild(document.createElement("br"));
        editor.dom.nodesInsertAfter([td], node);
      }
      node.removeAttribute("colspan");
    };
    func["unmerge"] = () => {
      if (node.nodeName === "TH")
        return func["unmerge_header"]();
      let tr = editor.dom.nodeParent(node, "TR"), trs = tbody.querySelectorAll("tr");
      const col2 = editor.dom.nodePosition(node), row = editor.dom.nodePosition(tr);
      let noderow = parseInt(node.getAttribute("rowspan") || "1", 10), nodecol = parseInt(node.getAttribute("colspan") || "1", 10);
      if (noderow === 1 && nodecol === 1)
        return;
      for (let i = row; i < row + noderow; i++) {
        const thisrow = trs[i];
        let tds = thisrow.querySelectorAll(node.nodeName);
        if (i > row) {
          const td = document.createElement(node.nodeName);
          if (cellStyle)
            td.setAttribute("style", cellStyle);
          td.appendChild(document.createElement("br"));
          thisrow.insertBefore(td, tds[col2]);
          tds = thisrow.querySelectorAll(node.nodeName);
        }
        for (let j = col2 + 1; j < col2 + nodecol; j++) {
          const td = document.createElement(node.nodeName);
          if (cellStyle)
            td.setAttribute("style", cellStyle);
          td.appendChild(document.createElement("br"));
          if (i === row) {
            editor.dom.nodesInsertAfter([td], tds[col2]);
          } else {
            tds[col2].parentElement.insertBefore(td, tds[col2]);
          }
        }
      }
      node.removeAttribute("rowspan");
      node.removeAttribute("colspan");
    };
    if (typeof func[value] === "function")
      func[value]();
    editor.triggerChange();
  }
  var table_default3 = [
    {
      event: "registerLanguage",
      target: [],
      callback: () => {
        const ln = {};
        ln["en"] = {
          "table": "table",
          "TABLE STYLE": "TABLE STYLE",
          "Apply": "Apply",
          "CELL STYLE": "CELL STYLE",
          "Apply To": "Apply To",
          "All": "All",
          "Cell": "Cell",
          "Row": "Row",
          "INSERT HEADER": "INSERT HEADER",
          "DELETE HEADER": "DELETE HEADER",
          "INSERT ROW ABOVE": "INSERT ROW ABOVE",
          "INSERT ROW BELOW": "INSERT ROW BELOW",
          "INSERT COLUMN LEFT": "INSERT COLUMN LEFT",
          "INSERT COLUMN RIGHT": "INSERT COLUMN RIGHT",
          "DELETE ROW": "DELETE ROW",
          "DELETE COLUMN": "DELETE COLUMN",
          "MERGE DOWN": "MERGE DOWN",
          "MERGE RIGHT": "MERGE RIGHT",
          "UNMERGE": "UNMERGE"
        };
        return ln;
      }
    },
    {
      event: "onKeyDown",
      target: ["tab"],
      callback: (editor, e) => {
        if (!editor.feature.path.includes("TD") && !editor.feature.path.includes("TH") && !editor.feature.path.includes("TABLE"))
          return;
        const node = editor.dom.nodeParent(editor.feature.node, "TD") || editor.dom.nodeParent(editor.feature.node, "TH");
        if (!node)
          return;
        const table = editor.feature.pathNode[editor.feature.path.indexOf("TABLE")];
        if (!table)
          return;
        const tds = Array.from(table.querySelectorAll("TH,TD"));
        const currentIdx = tds.indexOf(node);
        if (currentIdx === -1)
          return;
        e.preventDefault();
        e.stopPropagation();
        if (currentIdx === tds.length - 1) {
          if (editor.refContent.lastElementChild === table) {
            editor.refContent.appendChild(document.createElement("br"));
          }
          editor.dom.setCaretAt(table.nextSibling, 0);
        } else {
          editor.dom.setCaretAt(tds[currentIdx + 1], 0);
        }
      }
    },
    {
      event: "onCommand",
      target: ["table"],
      callback: (editor, cmd, value, styleValue, styleApplyTo) => {
        var _a;
        const v = value.split(",");
        if (v.length === 1) {
          if (value === "table_style")
            table_style(editor, styleValue);
          else if (value === "cell_style")
            cell_style(editor, styleValue, styleApplyTo);
          else
            table_function(editor, value);
          return;
        }
        let ths = [], th = [], trs = [], focus_row = parseInt(v[0], 10), focus_col = parseInt(v[1], 10);
        for (let j = 0; j < focus_col; j++) {
          th.push("<th>header " + (j + 1) + "</th>");
        }
        ths.push("<tr>" + th.join("") + "</tr>");
        for (let i = 0; i < focus_row; i++) {
          let tr = [];
          for (let j = 0; j < focus_col; j++) {
            tr.push("<td><br></td>");
          }
          trs.push("<tr>" + tr.join("") + "</tr>");
        }
        const table = document.createElement("table");
        table.innerHTML = "<thead>" + ths.join("") + "</thead><tbody>" + trs.join("") + "</tbody>";
        const insertAfterIdx = editor.feature.path.findIndex((p) => ["BLOCKQUOTE", "PRE", "CODE", "OL", "UL", "TABLE"].indexOf(p) !== -1);
        if (insertAfterIdx !== -1) {
          editor.dom.nodesInsertAfter([document.createElement("br"), table], editor.feature.path.length > insertAfterIdx + 1 && editor.feature.path[insertAfterIdx] === "CODE" && editor.feature.path[insertAfterIdx + 1] === "PRE" ? editor.feature.pathNode[insertAfterIdx + 1] : editor.feature.pathNode[insertAfterIdx]);
        } else {
          const { range } = editor.getSelectionRange();
          range.deleteContents();
          range.insertNode(table);
        }
        const tableStyle = editor.getCfg("table.default.table.style"), headerStyle = editor.getCfg("table.default.header.cell.style"), cellStyle = editor.getCfg("table.default.cell.style");
        if (tableStyle)
          table.setAttribute("style", tableStyle);
        if (headerStyle)
          Array.from(table.querySelectorAll("TH")).forEach((n) => n.setAttribute("style", headerStyle));
        if (cellStyle)
          Array.from(table.querySelectorAll("TBODY TD")).forEach((n) => n.setAttribute("style", cellStyle));
        const usableParent3 = (node) => {
          const path = [];
          path.push(node);
          while (editor.dom.nodeIsTextInlineOrVoid(node) && node !== editor.refContent && ["DIV", "TD", "TH", "LI"].indexOf(node.nodeName) === -1) {
            node = node.parentNode;
            path.push(node);
          }
          return path;
        };
        const nodePath = usableParent3(table);
        const pNode = nodePath.find((n) => n.nodeName === "P");
        if (pNode && table.parentElement) {
          if (((_a = table.parentElement) == null ? void 0 : _a.nodeName) === "P") {
            editor.dom.nodeBreak(pNode, table);
          }
          const p = document.createElement("p");
          if (table.parentElement.lastChild === table) {
            editor.dom.nodesInsertAfter([table], table.parentElement);
          } else {
            for (let i = Array.from(table.parentElement.childNodes).indexOf(table) + 1, j = table.parentElement.childNodes.length; i < j; i++) {
              p.appendChild(table.parentElement.childNodes[i]);
            }
            editor.dom.nodesInsertAfter([table, p], table.parentElement);
          }
        }
        if (editor.refContent.lastChild === table) {
          editor.refContent.appendChild(document.createElement("br"));
        }
        editor.dom.setCaretAt(table.querySelector("tbody td"), 0);
        editor.triggerChange();
      }
    }
  ];

  // src/plugins/image.ts
  var getCfg = (editor) => {
    const cfg = {
      "image.features": ["url", "upload", "library"],
      "image.accept.types": "image/jpeg, image/jpg, image/png, image/apng, image/gif, image/webp",
      "image.library.fetch": null,
      "image.library.per.page": 20,
      "image.library.allow.paging": true,
      "image.library.allow.search": true,
      "image.upload.url": "",
      "image.upload.max.size": 0,
      "image.upload.max.size.per.file": 0,
      "image.upload.accept.files": 0,
      "image.upload.handler": null,
      "image.url.rewrite.handler": (u) => {
        return u.replace("http://", "//").replace("https://", "//");
      }
    };
    Object.keys(cfg).forEach((key) => {
      cfg[key] = editor.getCfg(key);
    });
    return cfg;
  };
  var renderLibrary = (editor, content) => {
    const cfg = getCfg(editor);
    if (typeof cfg["image.library.fetch"] !== "function")
      return;
    content.classList.remove("horizontal");
    content.innerHTML = '<div class="padding"><div class="FileTileImageGrid ImageLibrary"></div></div>';
    editor.setCache("image.library.current.keyword", "");
    const fetchPage = (page, keyword) => {
      const currentKeyword = editor.getCache("image.library.current.keyword") || "";
      if (currentKeyword !== keyword)
        page = 1;
      editor.setCache("image.library.current.page", page);
      editor.setCache("image.library.current.keyword", keyword);
      cfg["image.library.fetch"](page, cfg["image.library.per.page"], keyword, (total, data) => {
        var _a;
        const totalPages = cfg["image.library.per.page"] ? Math.ceil(total / cfg["image.library.per.page"]) : 1;
        const grid = content.querySelector(".FileTileImageGrid");
        grid.innerHTML = "";
        data.forEach((item) => {
          const tile = item.tileFunc ? item.tileFunc() : renderTile(item);
          grid.appendChild(tile);
          tile.addEventListener("click", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            editor.command("image", ["library", item]);
            editor.toolbar.hideDropdown();
            return false;
          });
        });
        (_a = editor.toolbar) == null ? void 0 : _a.adjustContentPosition(content);
        if (grid.parentElement.querySelector(".FileTileImageGridFooter")) {
          grid.parentElement.removeChild(grid.parentElement.querySelector(".FileTileImageGridFooter"));
        }
        if (!cfg["image.library.allow.paging"] && !cfg["image.library.allow.search"])
          return;
        const footer = document.createElement("div");
        footer.setAttribute("class", "FileTileImageGridFooter");
        const pagination = document.createElement("nav");
        pagination.setAttribute("class", "FileTileImageGridPagination");
        footer.appendChild(pagination);
        grid.parentElement.appendChild(footer);
        if (cfg["image.library.allow.paging"]) {
          const prev = document.createElement("a");
          prev.setAttribute("class", "previous se-button");
          pagination.appendChild(prev);
          prev.innerHTML = '<span class="se-icon">' + SubEditor.svgList["previous"] + "</span>";
          const pageSpan = document.createElement("span");
          pagination.appendChild(pageSpan);
          const current = document.createElement("input");
          current.setAttribute("type", "text");
          current.setAttribute("class", "current");
          current.value = page.toString();
          pageSpan.appendChild(current);
          const totalSpan = document.createElement("span");
          totalSpan.setAttribute("class", "total");
          totalSpan.innerHTML = "/ " + totalPages;
          pageSpan.appendChild(totalSpan);
          const next = document.createElement("a");
          next.setAttribute("class", "next se-button");
          pagination.appendChild(next);
          next.innerHTML = '<span class="se-icon">' + SubEditor.svgList["next"] + "</span>";
          prev.addEventListener("click", (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            const kw = pagination.querySelector("input.keyword").value || "";
            if (kw !== keyword)
              fetchPage(1, kw);
            else if (page > 1) {
              fetchPage(page - 1, kw);
            }
            return false;
          });
          next.addEventListener("click", (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            const kw = pagination.querySelector("input.keyword").value || "";
            if (kw !== keyword)
              fetchPage(1, kw);
            else if (page < totalPages) {
              fetchPage(page + 1, kw);
            }
            return false;
          });
          current.addEventListener("keydown", (ev) => {
            if (ev.key !== "Enter")
              return;
            ev.preventDefault();
            ev.stopPropagation();
            const targetPage = parseInt(pagination.querySelector("input.current").value, 10);
            const kw = pagination.querySelector("input.keyword").value || "";
            if (kw !== keyword)
              fetchPage(1, kw);
            else if (targetPage != page && targetPage > 0 && targetPage <= totalPages) {
              fetchPage(targetPage, kw);
            }
            return false;
          });
          current.addEventListener("blur", () => {
            const targetPage = parseInt(pagination.querySelector("input.current").value, 10);
            const kw = pagination.querySelector("input.keyword").value || "";
            if (kw !== keyword)
              fetchPage(1, kw);
            else if (targetPage != page && targetPage > 0 && targetPage <= totalPages) {
              fetchPage(targetPage, kw);
            }
          });
        }
        if (cfg["image.library.allow.search"]) {
          const keywordInput = document.createElement("input");
          keywordInput.setAttribute("type", "text");
          keywordInput.setAttribute("class", "keyword");
          keywordInput.setAttribute("keyword", editor.ln("keyword"));
          keywordInput.value = keyword;
          pagination.appendChild(keywordInput);
          const search = document.createElement("a");
          search.setAttribute("class", "search se-button");
          pagination.appendChild(search);
          search.innerHTML = '<span class="se-icon">' + SubEditor.svgList["search"] + "</span>";
          search.addEventListener("click", (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            const kw = keywordInput.value || "";
            if (kw !== keyword)
              fetchPage(1, kw);
            return false;
          });
        }
      });
    };
    const current_page = editor.getCache("image.library.current.page");
    fetchPage(current_page && typeof current_page === "string" ? parseInt(current_page, 10) : current_page || 1, editor.getCache("image.library.current.keyword") || "");
    editor.toolbar.adjustContentPosition(content);
    editor.toolbar.insertCloseButton(content.parentElement.parentElement);
  };
  var isImage = (type) => type.indexOf("image/") !== -1;
  var renderTile = (item) => {
    const btn = document.createElement("button");
    if (isImage(item.type)) {
      btn.innerHTML = '<figure><figure><img src="' + (item.thumb || item.url) + '" alt="' + item.name + '"></figure></figure><span class="caption">' + item.name + "</span>";
    } else {
      btn.innerHTML = '<figure><figure><span class="text">' + item.name + '</span></figure></figure><span class="caption">' + item.name + "</span>";
    }
    return btn;
  };
  var processUpload = (editor, idx, file, el, completed) => {
    const url = editor.getCfg("image.upload.url") || "", cfgUploadHandler = editor.getCfg("image.upload.handler"), cfgUrlRewriteHandler = editor.getCfg("image.url.rewrite.handler");
    if (!url)
      return;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    const fd = new FormData();
    fd.append("file", file);
    xhr.upload.addEventListener("progress", (ev) => {
      const percent = Math.min(100, Math.floor(ev.loaded / ev.total * 1e4) / 100);
      el.querySelector(".text").innerHTML = editor.ln("uploading") + " " + percent + "%";
    });
    xhr.addEventListener("error", () => {
      xhr.abort();
    });
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 0) {
          el.classList.add("failed");
          el.querySelector(".text").innerHTML = editor.ln("upload failed");
          editor.cachedList["image.upload.result.list"][idx] = { status: "failed" };
          completed(false);
          return;
        }
        cfgUploadHandler(file, xhr.responseText, (_url, _thumb, _obj, _elFunc = void 0) => {
          el.classList.add("completed");
          const url2 = typeof cfgUrlRewriteHandler === "function" ? cfgUrlRewriteHandler(_url) : _url, thumb2 = typeof cfgUrlRewriteHandler === "function" ? cfgUrlRewriteHandler(_thumb) : _thumb;
          editor.cachedList["image.upload.result.list"][idx] = { status: "completed", name: file.name, type: file.type, url: url2, thumb: thumb2, obj: _obj, elFunc: _elFunc };
          if (isImage(file.type)) {
            const img = document.createElement("img");
            img.setAttribute("src", thumb2);
            el.setAttribute("data-thumb", thumb2);
            el.querySelector("figure figure").innerHTML = img.outerHTML;
          } else {
            el.querySelector(".text").innerHTML = file.type === "text/plain" ? "TXT" : file.type.substring(file.type.indexOf("/") + 1).toUpperCase();
          }
          el.setAttribute("data-url", url2);
          completed(true);
        });
      }
    };
    xhr.send(fd);
  };
  var renderUpload = (editor, content) => {
    var _a;
    content.classList.remove("horizontal");
    let cfgAcceptTypes = editor.getCfg("image.accept.types") || "";
    const cfgUploadAcceptFiles = editor.getCfg("image.upload.accept.files") || 0, cfgMaxSize = editor.getCfg("image.upload.max.size") || 0, cfgMaxSizePerFile = editor.getCfg("image.upload.max.size.per.file") || 0;
    content.innerHTML = "";
    editor.dom.appendString2Node('<div class="padding"><div class="uploadcontainer"><strong>' + editor.ln("drop or click to upload image") + '</strong><input type="file" name="file" ' + (cfgUploadAcceptFiles > 0 ? "multiple" : "") + "></div></div>", content);
    (_a = editor.toolbar) == null ? void 0 : _a.adjustContentPosition(content);
    editor.toolbar.insertCloseButton(content.parentElement.parentElement);
    const input = content.querySelector('input[type="file"]'), uploadContainer = input.parentElement;
    if (cfgAcceptTypes)
      input.setAttribute("accept", cfgAcceptTypes);
    editor.cachedList["image.upload.result.list"] = [];
    let previewGrid, gridContainer, uploadAgainBtn, insertBtn;
    const onFiles = (files) => {
      uploadContainer.style.display = "none";
      if (!content.querySelector(".FileTileImageGridContainer")) {
        previewGrid = document.createElement("div");
        previewGrid.classList.add("FileTileImageGrid");
        gridContainer = document.createElement("div");
        gridContainer.classList.add("FileTileImageGridContainer");
        gridContainer.appendChild(previewGrid);
        uploadContainer.parentElement.appendChild(gridContainer);
        const footer = document.createElement("div");
        if (uploadContainer.parentElement.querySelector(".FileTileImageGridFooter")) {
          uploadContainer.parentElement.removeChild(uploadContainer.parentElement.querySelector(".FileTileImageGridFooter"));
        }
        footer.classList.add("FileTileImageGridFooter");
        uploadContainer.parentElement.appendChild(footer);
        insertBtn = document.createElement("button");
        insertBtn.innerHTML = editor.ln("UPLOADING...");
        insertBtn.setAttribute("disabled", "disabled");
        insertBtn.setAttribute("class", "button insert");
        footer.appendChild(insertBtn);
        uploadAgainBtn = document.createElement("button");
        uploadAgainBtn.innerHTML = editor.ln("START OVER");
        uploadAgainBtn.setAttribute("class", "se-button upload_again");
        uploadAgainBtn.style.display = "none";
        insertBtn.parentElement.insertBefore(uploadAgainBtn, insertBtn);
        uploadAgainBtn.addEventListener("click", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          renderUpload(editor, content);
          return false;
        });
        insertBtn.addEventListener("click", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          editor.command("image", ["upload"]);
          editor.toolbar.hideDropdown();
          return false;
        });
      } else {
        gridContainer = content.querySelector(".FileTileImageGridContainer");
        previewGrid = content.querySelector(".FileTileImageGrid");
        uploadAgainBtn = content.querySelector(".upload_again");
        insertBtn = content.querySelector(".insert");
      }
      let count = previewGrid.querySelectorAll("button").length, completed = count, failed = 0;
      if (cfgMaxSize > 0 || cfgMaxSizePerFile > 0) {
        let err_size = false, err_size_per_file = false, total_size = 0;
        Array.from(files).forEach((file) => {
          if (cfgMaxSizePerFile > 0 && file.size / 1048576 > cfgMaxSizePerFile) {
            err_size_per_file = true;
          }
          total_size += file.size;
          if (cfgMaxSize > 0 && total_size / 1048576 > cfgMaxSize) {
            err_size = true;
          }
        });
        if (err_size || err_size_per_file) {
          uploadContainer.style.display = "";
          gridContainer.remove();
          if (uploadContainer.parentElement.querySelector(".FileTileImageGridFooter")) {
            uploadContainer.parentElement.removeChild(uploadContainer.parentElement.querySelector(".FileTileImageGridFooter"));
          }
          const text = uploadContainer.querySelector("strong");
          const cachedText = text.innerHTML;
          let errText = "";
          if (err_size)
            errText = "<small>" + editor.ln("max allowed size of all files in total should be ") + " " + cfgMaxSize + "MB. </small>";
          if (err_size_per_file)
            errText += "<small>" + editor.ln("max allowed size per file should be ") + " " + cfgMaxSizePerFile + "MB. </small>";
          text.innerHTML = errText;
          setTimeout(() => {
            text.innerHTML = cachedText;
          }, 5e3);
          return;
        }
      }
      Array.from(files).forEach((file) => {
        if (cfgAcceptTypes.indexOf(file.type) === -1 && cfgAcceptTypes.indexOf(file.type.substring(0, file.type.indexOf("")) + "/*") === -1)
          return;
        if (cfgUploadAcceptFiles > 0 && count + 1 > cfgUploadAcceptFiles)
          return;
        count++;
        const tile = document.createElement("button");
        editor.dom.appendString2Node('<figure><figure><span class="text">uploading 0%</span></figure></figure><span class="caption">' + file.name + "</span>", tile);
        tile.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        });
        previewGrid.appendChild(tile);
        editor.cachedList["image.upload.result.list"].push({});
        processUpload(editor, count - 1, file, tile, (status) => {
          var _a2;
          completed++;
          if (!status)
            failed++;
          if (completed >= count) {
            (_a2 = content.querySelector(".FileTileImageGrid button.upload")) == null ? void 0 : _a2.remove();
            if (failed > 0 && completed === failed) {
              uploadAgainBtn.style.display = "";
              insertBtn.style.display = "none";
            } else {
              insertBtn.removeAttribute("disabled");
              insertBtn.innerHTML = editor.ln("insert");
              if (cfgUploadAcceptFiles === 0 || count < cfgUploadAcceptFiles) {
                const dropBtnTile = document.createElement("button");
                dropBtnTile.setAttribute("class", "upload");
                dropBtnTile.innerHTML = SubEditor.svgList["plus"];
                previewGrid.appendChild(dropBtnTile);
                const inputTile = document.createElement("input");
                inputTile.setAttribute("type", "file");
                if (cfgUploadAcceptFiles === 0 || cfgUploadAcceptFiles - count > 1) {
                  inputTile.setAttribute("multiple", "");
                }
                dropBtnTile.appendChild(inputTile);
                dropBtnTile.addEventListener("drop", (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!e.dataTransfer.files || !e.dataTransfer.files.length)
                    return;
                  onFiles(e.dataTransfer.files);
                });
                inputTile.addEventListener("change", (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const target = e.target;
                  if (target._mockfiles !== "undefined") {
                    onFiles(target._mockfiles);
                    return;
                  }
                  if (!target.files || target.files.length === 0)
                    return;
                  onFiles(target.files);
                });
              }
            }
          }
        });
        editor.toolbar.adjustContentPosition(content);
      });
      if (count === 0) {
        uploadContainer.style.display = "";
        gridContainer.remove();
        if (uploadContainer.parentElement.querySelector(".FileTileImageGridFooter")) {
          uploadContainer.parentElement.removeChild(uploadContainer.parentElement.querySelector(".FileTileImageGridFooter"));
        }
        const text = uploadContainer.querySelector("strong");
        const cachedText = text.innerHTML;
        text.innerHTML = "<small>" + editor.ln("please select the appropriate file types:") + " " + cfgAcceptTypes + "</small>";
        setTimeout(() => {
          text.innerHTML = cachedText;
        }, 5e3);
      }
    };
    uploadContainer.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!e.dataTransfer.files || !e.dataTransfer.files.length)
        return;
      onFiles(e.dataTransfer.files);
    });
    input.addEventListener("change", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target;
      if (target._mockfiles !== "undefined") {
        onFiles(target._mockfiles);
        return;
      }
      if (!target.files || target.files.length === 0)
        return;
      onFiles(target.files);
    });
  };
  var renderURL = (editor, content) => {
    var _a;
    content.classList.remove("horizontal");
    content.innerHTML = "";
    editor.dom.appendString2Node('<div class="padding"><div class="se-dropdown-item"><input type="text" name="url"><label>' + editor.ln("image url") + '</label></div><div style="text-align: right;margin-right:5px"><button class="se-button insert">' + editor.ln("insert") + "</button></div></div>", content);
    editor.toolbar.insertCloseButton(content.parentElement.parentElement);
    (_a = editor.toolbar) == null ? void 0 : _a.adjustContentPosition(content);
    content.querySelector("button.insert").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const url = content.querySelector("input").value || "";
      if (url) {
        editor.command("image", ["url", url]);
        editor.toolbar.hideDropdown();
      }
      return false;
    });
  };
  var image_default = [
    {
      event: "registerSvg",
      target: [],
      callback: () => {
        return { "test": SubEditor.svgList["b"] };
      }
    },
    {
      event: "registerCss",
      target: [],
      callback: () => {
        return {};
      }
    },
    {
      event: "registerLanguage",
      target: [],
      callback: () => {
        const ln = {};
        ln["en"] = {
          "image": "image",
          "uploading": "uploading",
          "upload failed": "upload failed",
          "drop or click to upload image": "drop or click to upload image",
          "insert": "insert",
          "please select the appropriate file types:": "please select the appropriate file types:",
          "max allowed size per file should be ": "max allowed size per file should be ",
          "max allowed size of all files in total should be ": "max allowed size of all files in total should be ",
          "UPLOADING...": "UPLOADING...",
          "START OVER": "START OVER"
        };
        return ln;
      }
    },
    {
      event: "registerToolbarItem",
      target: [],
      callback: (editor) => {
        return {
          library: {
            command: "library",
            svg: SubEditor.svgList["image_library"],
            tips: editor.ln("image library"),
            dropdowncontent: '<div class="se-dropdown se-ToolbarItem" data-tips="' + editor.ln("image library") + '"><div class="se-dropdown-trigger"><button class="se-button" aria-haspopup="true" aria-controls="dropdown-menu-image"><span></span><span class="se-icon">' + SubEditor.svgList["image_library"] + '</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-image" role="menu"><div class="se-dropdown-content se-control"></div></div></div>',
            onRender: (_editor, el) => {
              var _a;
              const menu = el.querySelector(".se-dropdown-menu");
              (_a = el.querySelector(".se-dropdown-trigger > button")) == null ? void 0 : _a.addEventListener("click", () => {
                if (!menu.classList.contains("is-active")) {
                  editor.setCache("currentSelection", _editor.selection);
                  _editor.handleFeature();
                  const cfg = getCfg(editor), content = el.querySelector(".se-dropdown-content");
                  if (!content.querySelector(".ImageLibrary")) {
                    if (typeof cfg["image.library.fetch"] !== "function")
                      return;
                    renderLibrary(_editor, content);
                  }
                }
              });
            }
          }
        };
      }
    },
    {
      event: "registerToolbarItem",
      target: [],
      callback: (editor) => {
        return {
          image: {
            command: "image",
            svg: SubEditor.svgList["image"],
            tips: editor.ln("image"),
            dropdowncontent: '<div class="se-dropdown se-ToolbarItem" data-tips="' + editor.ln("image") + '"><div class="se-dropdown-trigger"><button class="se-button" aria-haspopup="true" aria-controls="dropdown-menu-image"><span></span><span class="se-icon">' + SubEditor.svgList["image"] + '</span></button></div><div class="se-dropdown-menu" id="dropdown-menu-image" role="menu"><div class="se-dropdown-content se-control"></div></div></div>',
            onRender: (_editor, el) => {
              var _a;
              const menu = el.querySelector(".se-dropdown-menu");
              (_a = el.querySelector(".se-dropdown-trigger > button")) == null ? void 0 : _a.addEventListener("click", () => {
                if (!menu.classList.contains("is-active")) {
                  editor.setCache("currentSelection", _editor.selection);
                  _editor.handleFeature();
                  const cfg = getCfg(editor), cfgFeatures = cfg["image.features"] || [], content = el.querySelector(".se-dropdown-content");
                  if (cfgFeatures.length === 1 && cfgFeatures[0] === "library") {
                    if (!content.querySelector(".ImageLibrary")) {
                      if (typeof cfg["image.library.fetch"] !== "function")
                        return;
                      renderLibrary(_editor, content);
                    }
                  } else if (cfgFeatures.length === 0 || cfgFeatures.length === 1 && cfgFeatures[0] === "url") {
                    renderURL(_editor, content);
                  } else {
                    content.classList.add("horizontal");
                    content.innerHTML = "";
                    cfgFeatures.forEach((f) => {
                      switch (f) {
                        case "url":
                          editor.dom.appendString2Node('<span class="se-button se-ToolbarItem" data-command="' + f + '" data-value="' + f + '" data-tips="image ' + f + '"><span class="se-icon">' + SubEditor.svgList["link"] + "</span></span>", content);
                          content.querySelector('span.se-button[data-value="url"]').addEventListener("click", (e) => {
                            renderURL(_editor, content);
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                          });
                          break;
                        case "upload":
                          if (!cfg["image.upload.url"])
                            return;
                          editor.dom.appendString2Node('<span class="se-button se-ToolbarItem" data-command="' + f + '" data-value="' + f + '" data-tips="image ' + f + '"><span class="se-icon">' + SubEditor.svgList["upload"] + "</span></span>", content);
                          content.querySelector('span.se-button[data-value="upload"]').addEventListener("click", (e) => {
                            renderUpload(_editor, content);
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                          });
                          break;
                        case "library":
                          if (typeof cfg["image.library.fetch"] !== "function")
                            return;
                          editor.dom.appendString2Node('<span class="se-button se-ToolbarItem" data-command="' + f + '" data-value="' + f + '" data-tips="image ' + f + '"><span class="se-icon">' + SubEditor.svgList["image_library"] + "</span></span>", content);
                          content.querySelector('span.se-button[data-value="library"]').addEventListener("click", (e) => {
                            renderLibrary(_editor, content);
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                          });
                          break;
                      }
                    });
                  }
                }
              });
            }
          }
        };
      }
    },
    {
      event: "onCommand",
      target: ["image"],
      callback: (editor, type, action, value) => {
        var _a, _b;
        const { range } = editor.getSelectionRange();
        let nodes = [];
        if (action === "upload") {
          const _nodes = [];
          editor.cachedList["image.upload.result.list"].forEach((n) => {
            if (n.status === "failed")
              return;
            if (typeof n.elFunc === "function") {
              _nodes.push(n.elFunc());
              return;
            }
            if (n.type.indexOf("image/") !== -1) {
              const _node = document.createElement("img");
              _node.setAttribute("data-action", action);
              _node.setAttribute("src", n.url);
              _node.setAttribute("style", "max-width:100%");
              _nodes.push(_node);
            } else {
              const _node = document.createElement("a");
              _node.setAttribute("data-action", action);
              _node.setAttribute("href", n.url);
              _node.setAttribute("target", "_blank");
              _node.innerHTML = n.name;
              _nodes.push(_node);
            }
          });
          nodes = [];
          for (let i2 = 0, t = _nodes.length; i2 < t; i2++) {
            nodes.push(_nodes[i2]);
            if (i2 < t - 1)
              nodes.push(document.createElement("br"));
          }
        } else if (action === "library") {
          if (typeof value.elFunc === "function") {
            nodes.push(value.elFunc());
          } else if (value.type && value.url) {
            if (value.type.indexOf("image/") !== -1) {
              const _node = document.createElement("img");
              _node.setAttribute("data-action", action);
              _node.setAttribute("src", value.url);
              _node.setAttribute("style", "max-width:100%");
              nodes.push(_node);
            } else {
              const _node = document.createElement("a");
              _node.setAttribute("data-action", action);
              _node.setAttribute("href", value.url);
              _node.setAttribute("target", "_blank");
              _node.innerHTML = value.name || value.url;
              nodes.push(_node);
            }
          }
        } else if (action === "url") {
          const node = document.createElement("img");
          node.setAttribute("data-action", action);
          node.setAttribute("src", value);
          node.setAttribute("style", "max-width:100%");
          nodes.push(node);
        }
        if (range.endContainer.parentElement.nodeName === "CODE") {
          let el = range.endContainer.parentElement;
          if (el.parentElement.nodeName === "PRE")
            el = el.parentElement;
          editor.dom.nodesInsertAfter(nodes, el);
        } else {
          range.deleteContents();
          nodes.reverse();
          nodes.forEach((n) => range.insertNode(n));
          range.setEndAfter(nodes[nodes.length - 1]);
          for (var i = nodes.length - 1; i >= 0; i--) {
            if (["TABLE", "UL", "OL"].indexOf(nodes[i].parentElement.nodeName) !== -1) {
              editor.dom.nodesInsertAfter([nodes[i]], nodes[i].parentElement);
            }
          }
        }
        if (editor.refContent.lastChild === nodes[0]) {
          if (((_b = (_a = editor.refContent.lastElementChild) == null ? void 0 : _a.previousElementSibling) == null ? void 0 : _b.nodeName) === "P") {
            const p = document.createElement("p");
            p.appendChild(document.createElement("br"));
            editor.refContent.appendChild(p);
            range.setEndBefore(p.childNodes[0]);
          } else {
            editor.refContent.appendChild(document.createElement("br"));
            range.setEndAfter(editor.refContent.lastChild);
          }
        }
        range.collapse(false);
        editor.triggerChange();
      }
    }
  ];

  // src/plugins/index.ts
  var presetPlugins = {
    fullscreen: fullscreen_default2,
    hr: hr_default2,
    color: color_default2,
    source: source_default2,
    align: align_default2,
    text: text_default2,
    undo: undo_default2,
    redo: redo_default2,
    indent: indent_default2,
    format: format_default2,
    remove_format: remove_format_default2,
    link: link_default2,
    paste: paste_default,
    list: list_default2,
    table: table_default3,
    image: image_default
  };
  var plugins_default = presetPlugins;

  // src/subeditor.ts
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
      this.dobounceFeatureSelectionFocusNode = null;
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
      this.refEditor.style.width = (opts.width ? opts.width : this.refTextarea.clientWidth) + "px";
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
    ln(key) {
      if (this.lnFunc)
        return this.lnFunc(key) || key;
      return typeof _SubEditor.langList[this.lang] !== "undefined" && typeof _SubEditor.langList[this.lang][key] !== "undefined" ? _SubEditor.langList[this.lang][key] : key;
    }
    registerCallback(key, fn) {
      this.callbackList[key] = fn;
    }
    getCallback(key, args = void 0) {
      if (typeof this.callbackList[key] === "undefined")
        return;
      if (typeof this.callbackList[key] === "function")
        return this.callbackList[key](args);
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
          } else if (typeof plugins_default[plugin] !== "undefined") {
            this.event.register(plugins_default[plugin]);
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
      const focusNode = sel.focusNode.nodeType === 3 ? sel.focusNode.parentElement : sel.focusNode;
      if (this.dobounceFeatureSelectionFocusNode === focusNode)
        return;
      const feature = feature_default(sel.focusNode, this.refContent);
      if (this.feature === feature)
        return;
      this.feature = feature;
      this.dobounceFeatureSelectionFocusNode = feature.node;
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
      } else {
        this.refEl.removeChild(this.refEditor);
        this.refEl.removeChild(this.refTextarea);
      }
      Object.keys(this.docListener).forEach((ev) => {
        this.docListener[ev].forEach((i) => {
          document.removeEventListener(ev, i);
        });
      });
      this.refEl._SubEditor = void 0;
    }
    static presetLang(langList) {
      Object.keys(langList).forEach((ln) => {
        _SubEditor.langList[ln] = Object.assign({}, lang_default[ln] || {}, _SubEditor.langList[ln] || {}, langList[ln]);
      });
    }
    static initLang(langList) {
      Object.keys(lang_default).forEach((ln) => {
        _SubEditor.langList[ln] = Object.assign({}, lang_default[ln], _SubEditor.langList[ln] || {}, langList[ln] || {});
      });
      if (Object.keys(langList).length > 0)
        _SubEditor.presetLang(langList);
    }
    static presetSvg(_svg) {
      _SubEditor.svgList = Object.assign(_SubEditor.svgList, _svg);
    }
    static initSvg(userSvgList) {
      _SubEditor.svgList = Object.assign({}, svg_default, userSvgList);
    }
    static presetCss(cssString = "") {
      _SubEditor.presetCssString = cssString;
    }
    static initCss(cssString = "", skipCss = false) {
      let pluginCss = "";
      const SubEditorStyle = document.querySelector("#SubEditorStyle");
      if (skipCss && SubEditorStyle)
        return;
      Object.keys(_SubEditor.pluginCSS).forEach((p) => pluginCss += _SubEditor.pluginCSS[p]);
      const styleStr = css_default + "\n" + pluginCss + "\n" + _SubEditor.presetCssString + "\n" + cssString;
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
    handleChange(change) {
      this.event.trigger("onBeforeChange", "", [this]);
      if (this.refTextarea.style.display === "none") {
        this.refTextarea.value = this.refContent.innerHTML;
      }
      if (change && this.onChange)
        this.onChange(change);
    }
  };
  var SubEditor = _SubEditor;
  SubEditor.svgList = {};
  SubEditor.langList = {};
  SubEditor.presetPluginList = {};
  SubEditor.presetCssString = "";
  SubEditor.pluginCSS = {};

  // src/browser.js
  "use strict";
  if (typeof window !== "undefined") {
    window.SubEditor = SubEditor;
  }
})();
