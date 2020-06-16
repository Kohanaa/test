// `<option value="${text}">${text}</option>`
if ($('#connected').length) {
    var form = $('#connected');
    var inputPlatform = $('#connected select[name=platform]');
    var inputCopyright = $('#connected select[name=copyright]');
    inputPlatform.change(function (e) {
        var selectedCopyright = inputCopyright.val();
        $.ajax({
            url: '/api/copyrights/' + e.target.value,
            success: function (result) {
                var html = "<option value=''>выбор</option>";
                for (var i = 0; i < result.length; i++) {
                    html += `<option value="${result[i]}" ${selectedCopyright == result[i] ? 'selected' : ''}>${result[i]}</option>`;
                }
                inputCopyright.html(html);
                $('#connected').submit();
            }
        });
    });
    inputCopyright.change(function (e) {
        var selectedPlatform = inputPlatform.val();
        $.ajax({
            url: '/api/platforms/' + e.target.value,
            success: function (result) {
                var html = "<option value=''>выбор платформы</option>";
                for (var i = 0; i < result.length; i++) {
                    html += `<option value="${result[i]}" ${selectedPlatform == result[i] ? 'selected' : ''}>${result[i]}</option>`;
                }
                inputPlatform.html(html);
                $('#connected').submit();
            }
        });
    });
}
if ($('.block').length) {
    var applyAnswer = function () { }
    var answers = [];
    if ($('#data-test').length) {
        var success = $('#data-test').attr('data-success');
        var count = $("#data-test").attr("data-count")
        var testId=$("#data-test").attr("data-id")
        var answered = 0;
        var correct = 0;
        applyAnswer = function (res) {
            answered++;
            if (res) {
                correct++;
            }
            if (answered >= count) {
                console.log(answers)
                var result = Math.round(correct * 100 / answered)
                $(".message").text("result: " + result)
                $("#btn-view-more").css("display", "block")
                $("#btn-view-more a").attr('href', '/test/'+testId+'/result?answers=' +JSON.stringify(answers))
                if (result >= success) {
                    $(".message").addClass("alert-success")
                }
                else {
                    $(".message").addClass("alert-danger")
                }
            }
        }
    }
    $('.block .option').click(function (e) {
        var options = $(this).parent()
        if (options.attr("data-disabled")) {
            return false
        }
        var questionNum = options.attr("data-question-id")
        options.attr("data-disabled", true);
        options.find('.option').removeClass('active');
        $(this).addClass('active');
        var id = $(this).attr("data-id");
        answers[questionNum] = id;
        var answer = options.attr("data-answer");
        if (id == answer) {
            $(this).addClass("correct");
            applyAnswer(true);
        }
        else {
            $(this).addClass("incorrect");
            applyAnswer(false);
        }
        $(".next").addClass("active");
    })
}