angular.module('OpenEXP')
    .controller('ReactionCtrl', ['$scope', ($scope) => {
        var welcome_block = {
            type: "text",
            text: "Welcome to the experiment. Press any key to begin."
        };

        /* define instructions block */
        var instructions_block = {
            type: "text",
            text: "<p>In this experiment, a circle will appear in the center " +
            "of the screen.</p><p>If the circle is <strong>blue</strong>, " +
            "press the letter F on the keyboard as fast as you can.</p>" +
            "<p>If the circle is <strong>orange</strong>, do not press " +
            "any key.</p>" +
            "<div class='left center-content'><img src='app/experiments/reactionTimeTask/images/blue.png'></img>" +
            "<p class='small'><strong>Press the F key</strong></p></div>" +
            "<div class='right center-content'><img src='app/experiments/reactionTimeTask/images/orange.png'></img>" +
            "<p class='small'><strong>Do not press a key</strong></p></div>" +
            "<p>Press any key to begin.</p>",
            timing_post_trial: 2000
        };

        /* define test block */

        var test_stimuli = [
            {
                image: "app/experiments/reactionTimeTask/images/blue.png",
                data: { response: 'go' }
            },
            {
                image: "app/experiments/reactionTimeTask/images/orange.png",
                data: { response: 'no-go' }
            }
        ];

        var all_trials = jsPsych.randomization.repeat(test_stimuli, 10, true);

        var post_trial_gap = function() {
            return Math.floor( Math.random() * 1500 ) + 750;
        }
        //var post_trial_gap = 2500

        var encoding_block = {
            type: "single-stim",
            stimuli: all_trials.image,
            choices: ['F'],
            data: all_trials.data,
            timing_response: 1000,
            timing_post_trial: post_trial_gap,
            triggers: '`'
        };

        /* define debrief block */

        function getAverageResponseTime() {

            var trials = jsPsych.data.getTrialsOfType('single-stim');

            var sum_rt = 0;
            var valid_trial_count = 0;
            for (var i = 0; i < trials.length; i++) {
                if (trials[i].response == 'go' && trials[i].rt > -1) {
                    sum_rt += trials[i].rt;
                    valid_trial_count++;
                }
            }
            return Math.floor(sum_rt / valid_trial_count);
        }

        var debrief_block = {
            type: "text",
            text: function() {
                return "<p>Your average response time was <strong>" +
                    getAverageResponseTime() + "ms</strong>. Press " +
                    "any key to complete the experiment. Thank you!</p>";
            }
        };

        /* create experiment definition array */
        var experiment = [];
        experiment.push(welcome_block);
        experiment.push(instructions_block);
        experiment.push(encoding_block);
        experiment.push(debrief_block);

        /* start the experiment */
        jsPsych.init({
            experiment_structure: experiment,
            display_element: $('#jspsych-target'),
            on_finish: function() {
                jsPsych.data.displayData();
            }
        });

    }]);
